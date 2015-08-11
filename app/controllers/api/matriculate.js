'use strict';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
	//errorHandler = require('../../app/controllers/errors.server.controller'),
	Candidate = mongoose.model('Candidate'),
	School = mongoose.model('School'),
	Faculty = mongoose.model('Faculty'),
	_ = require('lodash');

var matriculate_list = [];

module.exports = {
	log : function (school_code,message) {
		require('fs').appendFile(this.log_file+school_code+".txt"
			,'\n\n [' +(Date()) + '][' +school_code+ ']\n' + message);
		console.log('\n\n [' +(Date()) + '][' +school_code+ ']\n' + message);
	},
	log_test : function (school_code,message) {
		require('fs').appendFile(this.log_file_test+school_code+"_test.txt",
			'\n\n [' +(Date()) + '][' +school_code+ ']\n' + message);
		console.log('\n\n [' +(Date()) + '][' +school_code+ ']\n' + message);
	},
	init_log : function (school_code) {
		if (require('fs').existsSync(this.log_file+school_code+".txt")) {
			require('fs').unlink(this.log_file+school_code+".txt");
		}
		require('fs').writeFile(this.log_file+school_code+".txt",(Date())+' \n');
		if (require('fs').existsSync(this.log_file+school_code+"_test.txt")) {
			require('fs').unlink(this.log_file+school_code+"_test.txt");
		}
		require('fs').writeFile(this.log_file+school_code+"_test.txt",(Date())+' \n');
	},
	init : function (school, res, facultyFull) {
		this.res = res;
		this.facultyFull = facultyFull;
		//this.school_code = school;
		this.log_file = "/home/eroshaly/admissions/log_matriculate/matriculate_log_";
		this.log_file_test = "/home/eroshaly/admissions/log_matriculate/matriculate_log_";
		this.init_log(school);
		this.init_matriculate(school);
		this.log(school,'- Start School ['+school+']');
	},
	
	init_data_faculty: function (school_code) {
		this.log(school_code,'- init init data faculty ['+school_code+']');
		var _this = this;
		var this_school = _this.get_school(school_code);
		Candidate.find({
			school_code: school_code,
		})
		.exec(function(err, candidates) {
			if (err) {
				_this.log(school_code,'- ERROR'+err.toString());
			}else{
				this_school.resume = candidates.length;
				var candidate_all = _.uniq(candidates, 'student_id');

				_this.log(school_code,'- Candidate: '+candidate_all.length);
				
				this_school.candidate_all = candidate_all.length;

				for(var s_index in this_school.faculty_choice){
					var faculty_current = this_school.faculty_choice[s_index];
					var faculty_candidate = get_faculty_same(candidates, this_school.faculty_choice[s_index].code);
					faculty_current.candidate_apply = faculty_candidate.length;//_.pluck(faculty_candidate, 'student_id');
				}
				_this.set_school(this_school.school);
				_this.create_matriculate_list(this_school.school);											
			}
		});
	},
	//get school function
	get_school : function (school) {
		for(var x_index in matriculate_list){
			if(matriculate_list[x_index].school 
			=== school){
				return matriculate_list[x_index];
			}
		}
		return null;
	},//set school function
	set_school : function (school_object) {
		for(var x_index in matriculate_list){
			if(matriculate_list[x_index].school 
			=== school_object.school){
				matriculate_list[x_index] = school_object;
			}
		}
	},
	//init matriculate function
	init_matriculate : function (school) {
		var _this = this;
		this.log(school,'- init matriculate');
		var faculty_choice =  _.uniq(_.filter(this.facultyFull, function(object) {
				  return object.school_code === school;
				}));
		var total_quota = _.sum(faculty_choice, function(object) {
									  return object.quota;
									});
		var current_school = {
				school: school,
				faculty_choice: faculty_choice,
				total_quota : total_quota,
				matriculated_list : [],
				has_candidate : [],
				faculty_final : [],
				candidate_all: 0,
				resume : 0,
				save_to : true,
				matriculated : 0
			};
		var create = true;
		for(var x_index in matriculate_list){
		// 	---Find school
			if(matriculate_list[x_index].school 
			=== school){
				matriculate_list[x_index] = current_school;
				create = false;
				break;
			}
		}
		if(create){
			matriculate_list.push(current_school);			
		}
		this.init_data_faculty(current_school.school);
	},
	//create matriculate list function
	create_matriculate_list: function (school_code) {
		var _this = this;
		var this_school = _this.get_school(school_code);

		this.log(school_code,'- create matriculate list for School');

		Candidate.find({
			school_code: school_code,
			student_id : { '$nin': this_school.has_candidate }
		})
		.sort('-score_sum')
		.exec(function(err, candidates) {
			if (err) {
				_this.log(school_code,'- Query Faculty But ERROR - '+ err.toString());
			} else {
				_this.log_test(school_code,'- Query Faculty - '+ candidates.length);
				if(candidates.length > 0){
					for(var y_index in this_school.faculty_choice){

						//----Find faculty
						var candidate_choice = get_faculty_same(candidates, 
							this_school.faculty_choice[y_index].code);

						if(this_school.faculty_choice[y_index].quota >= 
							this_school.faculty_choice[y_index].current
							&& candidate_choice.length > 0
						){
							var faculty_current = this_school.faculty_choice[y_index];											
							
							candidate_choice.sort(compare_faculty_candidate_priority);
							var candidate_chunk =  _.chunk(candidate_choice, 
									this_school.faculty_choice[y_index].quota 
									- this_school.faculty_choice[y_index].current
								);
							var faculty_candidate = candidate_chunk[0];

							faculty_current.current += faculty_candidate.length;											
							faculty_current.matriculate_list = faculty_current.matriculate_list.concat(faculty_candidate);
							if(faculty_candidate.length > 0){
								faculty_current.benchmark = faculty_current.matriculate_list[
									faculty_current.matriculate_list.length -1].score_sum
							}
							// -----Working faculty													
							_this.log(school_code, 
								'-Faculty: '+faculty_current.code +
								'-More: '+faculty_candidate.length +
								'-Benchmark: '+faculty_current.benchmark +' \n');

							this_school.faculty_choice[y_index] = faculty_current;

							this_school.matriculated_list = this_school.matriculated_list.concat(
																faculty_candidate);
							_this.set_school(this_school);
						}
						if(this_school.faculty_choice[y_index].quota <= 
							this_school.faculty_choice[y_index].current
							&& this_school.faculty_final.indexOf(this_school.faculty_choice[y_index].code) 
									=== -1
							){
							this_school.faculty_final.push(this_school.faculty_choice[y_index].code);
							_this.set_school(this_school);
						}
					}
					_this.remove_candidates_same(this_school.school);	
				}else{
					_this.save_to_database(this_school.school);	
					//_this.remove_candidates_same(this_school.school);	
				}				
			}
		});
	},
	//remove candidates same function
	remove_candidates_same: function  (school_code) {
		var _this = this;
		var this_school = this.get_school(school_code);
		
		this.log(school_code,'\n- remove candidates same for School');
		
		var candidates = this_school.matriculated_list;	
		var list_same = [];

		var candidate_uniq = _.pluck(_.uniq(candidates, 'student_id'),'student_id');

		for(var x_index in candidate_uniq){
			var same = get_candidates_same(candidates, 
				candidate_uniq[x_index]);
			if(same.length > 1){
				same = _.sortBy(same, 'priority');
				same.shift();
				var pluck_same = _.pluck(same, '_id');
				list_same = list_same.concat(pluck_same);
			}
		}

		var candidates_matriculated = _.remove(candidates, function(object) {
			return list_same.indexOf(object._id) != -1;
		});

		this_school.has_candidate = this_school.has_candidate.concat(
										_.pluck(candidates_matriculated, 'student_id'));


		for(var y_index in this_school.faculty_choice){
			var faculty_candidate = get_faculty_same(candidates_matriculated, 
					this_school.faculty_choice[y_index].code);
				faculty_candidate.sort(compare_faculty_candidate_priority);
				faculty_candidate = _.sortBy(faculty_candidate, 'score_sum');
				
				
			var faculty_current = this_school.faculty_choice[y_index];

				faculty_current.current = faculty_candidate.length;
				if(faculty_candidate.length > 0){
					faculty_current.benchmark = faculty_candidate[faculty_candidate.length -1].score_sum
				}
				this.log(school_code,
					'-Faculty: '+this_school.faculty_choice[y_index].code +
					'-Current: '+faculty_candidate.length +
					'-Benchmark: '+faculty_current.benchmark +' \n');

				faculty_current.matriculate_list = faculty_candidate;

				this_school.faculty_choice[y_index] = faculty_current;
		}
		this.log(school_code,'Final School check - '+
			'faculty_final - '+this_school.faculty_final.length+
			'faculty_choice - '+this_school.faculty_choice.length +
			'candidate_all - '+this_school.candidate_all+
			'candidates - '+candidates.length
			)
		this_school.matriculated = candidates.length;
		this.set_school(this_school);
		if(this_school.faculty_final.length >= this_school.faculty_choice.length 
			|| this_school.candidate_all === candidates.length){
			this.log(school_code,'- Final School ['+this_school.school +']');
			this.save_to_database(this_school.school);
		}else{
			this.create_matriculate_list(this_school.school);
		}

	},
	//save to database
	save_to_database: function (school_code) {
		var this_school = this.get_school(school_code);
		var _this = this;
		this_school.faculty_final = [];
		for(var s_index in this_school.faculty_choice){
			this_school.faculty_choice[s_index].save(function(err, faculty) {
				if (err) {
					_this.log(school_code,err.toString());
				} else {
					_this.log(school_code,'Save -'+faculty.school_code + ' - ' + faculty.code + ' - ' + Date());
					this_school.faculty_final.push(faculty.code);
					this_school.faculty_final = _.uniq(this_school.faculty_final);
					_this.set_school(this_school);
					if(this_school.save_to && this_school.faculty_final.length >= this_school.faculty_choice.length){
						_this.log_test(school_code,'- save school database : '+faculty.code);
						_this.log_test(school_code,'- save school database : '+this_school.faculty_final.toString());
						// save_to
						this_school.save_to = false;
						_this.set_school(this_school);
						_this.save_school_database(this_school.school);
					}
				}
			});
		}
	},
	//save to database
	save_school_database: function (school_code) {
		var this_school = this.get_school(school_code);
		var _this = this;
		//this_school.faculty_final = [];
		this.log(school_code,'- save school database');
		School
		.findOne({code : school_code})
		.exec(function(err, school) {
			if (err) {
				_this.log(school_code,err.toString());
				_this.res.jsonp({
					result:false, 
					message:err.toString()
				});
			}else{
				_this.log(school_code,'- save school success');
				school.faculty_list = _.pluck(this_school.faculty_choice, 'code');
				school.quota = this_school.total_quota;
				school.status = 1;
				school.resume = this_school.resume;
				school.matriculated = this_school.matriculated;
				school.candidate = this_school.candidate_all;
				var benchmark = _.pluck(this_school.faculty_choice, 'benchmark');
				if(benchmark.length > 0){
					var benchmark_sort = _.sortBy(benchmark);
					school.largest_benchmark = benchmark_sort[benchmark_sort.length-1];
					school.smallest_benchmark = benchmark_sort[0];
				}
				school.modified = Date();				
				school.save(function(err, result) {
					if (err) {
						_this.log(school_code,err.toString());
						_this.res.jsonp({
							result:false, 
							message:err.toString()
						});
					} else {
						_this.log(school_code,'- save school success final');
						_this.res.jsonp({
							result:true, 
							message:''
						});
						return
					}
				});
			}
		});
	}
}

function get_candidates_same (list, value) {
	var result  = list.filter(function(item){return item.student_id == value;} );
	return result ? result : []; // or undefined
}

function get_faculty_same (list, value) {
	var result  = list.filter(function(item){return item.faculty == value;} );
	return result ? result : []; // or undefined
}

function compare_faculty_candidate_priority(candidate_a,candidate_b) {
	if (candidate_a.score_sum < candidate_b.score_sum)
    	return 1;
	if (candidate_a.score_sum > candidate_b.score_sum)
    	return -1;
	return 0;
}
function compare_candidate_priority(candidate_a,candidate_b) {
	if (candidate_a.priority < candidate_b.priority)
    	return -1;
	if (candidate_a.priority > candidate_b.priority)
    	return 1;
	return 0;
}
function compare_candidate_code(candidate_a,candidate_b) {
	if (candidate_a.student_id < candidate_b.student_id)
    	return -1;
	if (candidate_a.student_id > candidate_b.student_id)
    	return 1;
	return 0;
}