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



var initialization_list = [];

module.exports = {
	log : function (school_code,message) {
		require('fs').appendFile(this.log_file+school_code+".txt"
			,'\n\n [' +(Date()) + '][' +school_code+ ']\n' + message);
		//console.log('\n\n [' +(Date()) + '][' +school_code+ ']\n' + message);
	},
	log_test : function (school_code,message) {
		require('fs').appendFile(this.log_file_test+school_code+"_test.txt",
			'\n\n [' +(Date()) + '][' +school_code+ ']\n' + message);
		//console.log('\n\n [' +(Date()) + '][' +school_code+ ']\n' + message);
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
	init : function (res) {
			var _this = this
			this.res = res;
			// this.facultyFull = facultyFull;facultyFull
			//this.schoolAll = schoolAll;
			this.log_file = "log_matriculate/matriculate_log_initialization_";
			this.log_file_test = "log_matriculate/matriculate_log_initialization_";
			
			
			this.init_data();
			this.log('- Start School ');

		
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
					_this.log(school_code,'- faculty_choice: '+this_school.faculty_choice[s_index].code);
					var faculty_current = this_school.faculty_choice[s_index];
					var faculty_candidate = get_faculty_same(candidates, this_school.faculty_choice[s_index].code);
					faculty_current.candidate_apply = faculty_candidate.length;
				}
				_this.log(school_code,'- faculty_choice: '+this_school.faculty_choice.length);
				_this.set_school(this_school.school);
				_this.save_to_database(this_school.school);											
			}
		});
	},
	//get school function
	get_school : function (school) {
		for(var x_index in initialization_list){
			if(initialization_list[x_index].school 
			=== school){
				return initialization_list[x_index];
			}
		}
		return null;
	},//set school function
	set_school : function (school_object) {
		for(var x_index in initialization_list){
			if(initialization_list[x_index].school 
			=== school_object.school){
				initialization_list[x_index] = school_object;
			}
		}
	},
	init_data : function () {
		var _this = this;
		//console.log('initschools');
		var from = new Date();
		from.setHours(0); 
		from.setMinutes(0);
		from.setSeconds(0);
		from.setMilliseconds(0);

		//console.log('initschools from ', from.toISOString());
		School.findOne({status : 1, modified : {
			"$lt"  : from.toISOString()
		}})
		// .populate('user', 'displayName')
		.exec(function(err, school) {
			if (err){
				_this.res.jsonp({
					result:false, 
					message: err.toString()
				});
			}
			
			if (! school){
				_this.res.jsonp({
						result:true, 
						message: 'final'
					});
			}else{
				if(_.has(school, 'code')){
					
					School.update( 
						{_id : school._id}, 
						{ modified : new Date(new Date().setDate(new Date().getDate()-2))}, 
						{ multi: true }, 
						function (err, numberAffected, raw) {
							console.log('initschools');
							if(err){
								_this.init_data();
							}else{
								_this.init_data();
							}
					})
				}else{
					console.log('initschools school:', school.code);
					_this.init_log(school.code);
					_this.init_initialization(school.code);
				}
				
			}
			
		});
	},
	//init matriculate function
	init_initialization : function (school) {
		var _this = this;
		this.log(school,'- init initialization');
		Faculty.find({school_code : school}).exec(function(err, faculty_choice) {
			_this.log(school,'- faculty_choice: ' + faculty_choice.length);
			if(err){
				School.update( 
					{code : school}, 
					{ modified : new Date()}, 
					{ multi: true }, 
					function (err, numberAffected, raw) {
						//console.log('initschools');
						if(err){
							_this.init_data();
						}else{
							_this.init_data();
						}
				})
				//_this.init_data();
			}
			if(faculty_choice.length > 0){
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
				for(var x_index in initialization_list){
				// 	---Find school
					if(initialization_list[x_index].school 
					=== school){
						initialization_list[x_index] = current_school;
						create = false;
						break;
					}
				}
				if(create){
					initialization_list.push(current_school);			
				}
				_this.init_data_faculty(current_school.school);
			}else{
				School.update( 
					{code : school}, 
					{ modified : new Date()}, 
					{ multi: true }, 
					function (err, numberAffected, raw) {
						//console.log('initschools');
						if(err){
							_this.init_data();
						}else{
							_this.init_data();
						}
				})

			}
			////console.log(err, faculty);
			//facultyFull = faculty;
		});

		
		// var faculty_choice =  _.uniq(_.filter(this.facultyFull, function(object) {
		// 		  return object.school_code === school;
		// 		}));
		
	},
	
	//save to database
	save_to_database: function (school_code) {
		var this_school = this.get_school(school_code);
		var _this = this;
		this_school.faculty_final = [];
		for(var s_index in this_school.faculty_choice){
			this_school.faculty_choice[s_index].benchmark = 0;
			this_school.faculty_choice[s_index].save(function(err, faculty) {
				if (err) {
					_this.log(school_code,err.toString());
				} else {
					
					this_school.faculty_final.push(faculty.code);
					//this_school.faculty_final = _.uniq(this_school.faculty_final);
					_this.set_school(this_school);
					_this.log(school_code,'Save -'+faculty.school_code + ' - ' + faculty.code + ' - ' + Date());
					_this.log(school_code,'Save faculty_final : '+this_school.faculty_final.length );
					if(this_school.faculty_final.length >= this_school.faculty_choice.length){
						_this.log_test(school_code,'- save school database : '+faculty.code);
						_this.log_test(school_code,'- save school database : '+this_school.faculty_final.toString());
						// save_to
						// this_school.save_to = false;
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
					} else {
						_this.log(school_code,'- save school success final');
						_this.init_data();
					}
				});
			}
		});
	}
}
function get_faculty_same (list, value) {
	var result  = list.filter(function(item){return item.faculty == value;} );
	return result ? result : []; // or undefined
}

