'use strict';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
	Candidate = mongoose.model('Candidate'),
	School = mongoose.model('School'),
	Faculty = mongoose.model('Faculty'),
	_ = require('lodash');

module.exports = {
	init : function (school, res) {
		var  _this = this
		School
		.findOne({code : school})
		.sort('score_final')
		.exec(function(err, schools) {
			
			if (err) {
				_this.log('init err: ' + err.toString());
			} else {

				_this.school = school;
				_this.school_object = schools;
				_this.faculties = [];
				_this.faculties_final = [];
				_this.candidate_final = [];
				_this.log_file = "log_matriculate/matriculate_log_";
				_this.log_file_test = "log_matriculate/matriculate_log_";
				_this.init_log();
				_this.init_mix_max();
				_this.res = res;
				_this.log('init: ' + schools);
			}
		});
		
	},
	log: function  (message) {
		require('fs').appendFile(this.log_file+this.school+".txt"
			,'\n\n [' +(Date()) + '][' +this.school+ ']\n' + message);
		console.log('\n\n [' +(Date()) + '][' +this.school+ ']\n' + message);
	},
	log_test: function (message) {
		require('fs').appendFile(this.log_file_test+this.school+"_test.txt",
			'\n\n [' +(Date()) + '][' +this.school+ ']\n' + message);
		console.log('\n\n [' +(Date()) + '][' +this.school+ ']\n' + message);
	},
	init_log: function () {
		if (require('fs').existsSync(this.log_file+this.school+".txt")) {
			require('fs').unlink(this.log_file+this.school+".txt");
		}
		require('fs').writeFile(this.log_file+this.school+".txt",(Date())+' \n');
		if (require('fs').existsSync(this.log_file+this.school+"_test.txt")) {
			require('fs').unlink(this.log_file+this.school+"_test.txt");
		}
		require('fs').writeFile(this.log_file+this.school+"_test.txt",(Date())+' \n');
	},	
	init_mix_max : function  () {
		var _this = this;
		
		Candidate
		.find({school_code : _this.school},{score_final : 1})
		.sort('score_final')
		.limit(1)
		.exec(function(err, min) {
			
			if (err) {

			// 	res.jsonp({
			// 		result:false, 
			// 		message:err.toString()
			// 	});
			} else {
				_this.min = min[0].score_final;
				Candidate
				.find({school_code : _this.school},{score_final : 1})
				.sort('-score_final')
				.limit(1)
				.exec(function(err, max) {
					
					if (err) {
					// 	res.jsonp({
					// 		result:false, 
					// 		message:err.toString()
					// 	});
					} else {
						_this.max = max[0].score_final;
						Faculty.find({
							school_code : _this.school
						})
						.sort('-created')
						// .populate('user', 'displayName')
						.exec(function(err, faculties) {
							if (err) {
								// return res.status(400).send({
								// 	message: errorHandler.getErrorMessage(err)
								// });
							} else {
								//res.jsonp(faculties);
								for(var f_index in faculties){
									faculties[f_index].current = 0;
									faculties[f_index].benchmark = 0;
									faculties[f_index].candidate = 0;
									faculties[f_index].matriculate = 0;
									faculties[f_index].matriculate_list = [];
									faculties[f_index].candidate_apply = [];
								}
								console.log('faculties', faculties.length);
								_this.faculties = faculties;
								_this.get_candidate();
								
							}
						});
					}
				});
			}
		});
	},
	get_candidate: function  () {
		var _this = this;		
		_this.average = _.ceil((_this.min+_this.max)/2,2);

		_this.log('\n -get candidate start:' + ' min ' 
			+ _this.min + ' max ' + _this.max + ' average ' 
			+ _this.average);
		
		var conditions = {
			school_code : _this.school, 
			score_final : {$gte : _this.average, $lte : _this.max}
		};
		//_this.log('get candidate candidate_final oject : ' + _this.candidate_final.toString());
		if(_this.candidate_final.length > 0){

			conditions = _.extend(conditions,{
				student_id : {$nin : _this.candidate_final}
			});
		}
		// _this.log('\n -get candidate start: candidate_final - ' 
		// 	+ _this.candidate_final.length);

		if(_this.min === _this.max || _this.max === _this.average){
			_this.save_faculties();
		}else{

		//}

			Candidate
			.find(conditions,
				{score_final : 1, student_id : 1, faculty : 1, faculty_code:1}
			)
			.sort('-score_final')
			.exec(function(err, candidates) {
				
				if (err) {
				// 	res.jsonp({
				// 		result:false, 
				// 		message:err.toString()
				// 	});
					_this.log('get candidate err : ' + err.toString());
				} else {
					if(candidates.length > 0){
						_this.analytics(candidates);
					}else{
						_this.max = _this.average;
						_this.get_candidate();
					}
					////console.log('get candidate', candidates.length);
					//callback(min, max, faculties, average, candidates)
					//console.log('\n -get candidate start:', ' candidates ',candidates.length);
					
				}
			});
		}
	},
	remove_same_priority :function  (candidates_query) {
		var candidates_new = candidates_query.slice(0);
		var list_same = [];

		var candidate_uniq = _.pluck(_.uniq(candidates_new, 'student_id'),'student_id');

		for(var x_index in candidate_uniq){
			var _candidates = candidates_query.slice(0);
			var same = _.filter(_candidates, function(object) {
			  return object.student_id === candidate_uniq[x_index];
			});

			if(same.length > 1){
				same = _.sortBy(same, 'priority');
				same.shift();
				var pluck_same = _.pluck(same, '_id');
				list_same = list_same.concat(pluck_same);
			}
		}
		var _candidates = candidates_query.slice(0);
		var candidates = _.remove(_candidates, function(object) {
			return list_same.indexOf(object._id) != -1;
		});
		////console.log('remove_same_priority: ', candidates_query.length ,candidates.length);
		return candidates;
	},
	set_candidates_faculty : function  (faculties, candidates) {
		//console.log('set_candidates_faculty');
		for(var y_index in faculties){
			var candidates_new = candidates.slice(0); 
			
			var candidate_faculty = _.filter(candidates_new, function(object) {
			  return object.faculty === faculties[y_index].code;
			});
			//this.log(faculties[y_index].code);
			this.log('set_candidates_faculty:' + faculties[y_index].code + ' - ' + candidate_faculty.length);
			//console.log(faculties[y_index].code, candidate_faculty);
			if(candidate_faculty.length > 0 && faculties[y_index].quota > faculties[y_index].current){
				var candidate_choice = _.sortByOrder(candidate_faculty, ['score_final'],['desc']);
				var candidate_chunk =  _.chunk(candidate_choice, 
						faculties[y_index].quota 
						- faculties[y_index].current
					);
				var faculty_candidate = candidate_chunk[0];

				////console.log(faculties[y_index].code, faculty_candidate);
				if(faculty_candidate.length > 0){
					faculties[y_index].current += faculty_candidate.length;											
					faculties[y_index].matriculate_list = faculties[y_index].matriculate_list.concat(faculty_candidate);
					faculties[y_index].benchmark = faculty_candidate[faculty_candidate.length -1].score_final
				}
			}
			if(faculties[y_index].quota < faculties[y_index].current){
				this.faculties_final.push(this.faculties[y_index]);
				this.faculties.splice(y_index,1)
			}
			
		}
	},
	get_min_benchmark :function  (faculties, candidates) {
		this.log('get_min_benchmark start ' + faculties.length + ' ' + candidates.length);
		
		var benchmark = [];
		//if()
		for(var y_index in faculties){
			var candidates_new = candidates.slice(0); 

			var candidate_faculty = _.filter(candidates_new, function(object) {
			  return object.faculty === faculties[y_index].code;
			});
			//log('QSC', faculties[y_index].code);
			var candidate_choice = _.sortByOrder(candidate_faculty, ['score_final'],['desc']);
			//log('QSC', candidate_choice.toString());
			//log('QSC', 'candidate_chunk');
			var candidate_chunk =  _.chunk(candidate_choice, 
					faculties[y_index].quota 
					- faculties[y_index].current
				);
			//log('QSC', candidate_chunk.toString());
			var faculty_candidate = candidate_chunk[0];
			//////console.log(candidate_chunk[0]);
			// faculties[y_index].current += faculty_candidate.length;											
			// faculties[y_index].matriculate_list = faculties[y_index].matriculate_list.concat(faculty_candidate);
			if(candidate_chunk.length > 0 && faculty_candidate.length > 0){
				benchmark.push({benchmark : faculty_candidate[faculty_candidate.length -1].score_final});
				///faculties[y_index].benchmark = faculty_candidate[faculty_candidate.length -1].score_final
			}
		}
		
		var pluck = _.pluck(_.sortByOrder(benchmark,['benchmark'],['desc']), 'benchmark');
		this.log('get_min_benchmark pluck: ' + pluck.toString());
		return 	pluck[0];	
	},
	analytics:function  (candidates_query) {
		var _this = this;

		if(candidates_query.length > 0){

			var candidates_new = candidates_query.slice(0); 
			var candidates = _this.remove_same_priority (candidates_new);
			var min_benchmark = _this.get_min_benchmark(_this.faculties, candidates);
			
			this.log('min_benchmark: ' + min_benchmark);
			
			if(min_benchmark > _this.average){
				_this.average = min_benchmark;
				var _candidates = candidates_query.slice(0); 
				var candidates_filter =  _.filter(_candidates, function(object) {
				  return object.score_final >= min_benchmark;
				});
				candidates = _this.remove_same_priority (candidates_filter);
			}
			// else{
				
			// }
			//else {//if(min_benchmark == average){
				// get_candidate (min, benchmark[0], faculties)
			this.log('set_candidates_faculty : ' + candidates.length);
			_this.max = _this.average;
			var _candidates = candidates.slice(0); 
			_this.set_candidates_faculty (_this.faculties, _candidates);
			// for(var y_index in _this.faculties){
			// 	if(_this.faculties[y_index].quota - _this.faculties[y_index].current === 0){
			// 		_this.faculties_final.push(_this.faculties[y_index]);
			// 		_this.faculties.splice(y_index,1)
			// 	}
			// }
			_this.candidate_final = _this.candidate_final.concat(
				_.pluck(//_this.candidate_final.concat(
					_.uniq(candidates, 'student_id')
					//)
				, 'student_id'));

			this.log('faculties_final: faculties_final[' 
				+ _this.faculties_final.length +' - '+ _this.faculties.length
				+'] candidate['+_this.school_object.candidate +' - '+ _this.candidate_final.length
				+']');
			
			if(_this.faculties.length == 0 || 
				 _this.school_object.candidate <= _this.candidate_final.length
				){
				_this.save_faculties();
				console.log('-->faculties_final<--');
			}else{
				_this.get_candidate ();
			}
			//}

			// if()
			
			
			// var benchmark = _.pluck(_.sortByOrder(candidates_query,['benchmark'],['desc']), 'benchmark');
			
			// _this.remove_candidates_same(this_school.school);	
		}else{
			_this.max = _this.average;
			_this.get_candidate ();
			// _this.save_to_database(this_school.school);	
			//_this.remove_candidates_same(this_school.school);	
		}	
	},
	//save to database
	save_faculties :function  () {
		var _this = this;
		////console.log('save_faculties');
		// var this_school = this.get_school(school_code);
		// var _this = this;
		_this.log('save faculties start ' + _this.faculties_final.length);
		_this.faculties = [];
		for(var s_index in _this.faculties_final){
			Faculty
			.findOne({code : _this.faculties_final[s_index].code})
			//.populate('user', 'displayName')
			.exec(function(err, faculty) {
				if (err){
					_this.log('save faculties error: '+err.toString());
				}else{
					faculty.current = _this.faculties_final[s_index].current;//_.extend(faculty,_this.faculties_final[s_index]);
					faculty.benchmark = _this.faculties_final[s_index].benchmark;
					faculty.matriculate_list = _this.faculties_final[s_index].matriculate_list;
					faculty.matriculate = _this.faculties_final[s_index].matriculate_list.length;
					faculty.save(function(err, faculty) {
						if (err) {
							_this.log('save faculties error: '+err.toString());
						} else {
							_this.log('Save -'+faculty.school_code + ' - ' + faculty.code + ' - ' + Date());
							_this.faculties.push(faculty.code);
							// this_school.faculty_final = _.uniq(this_school.faculty_final);
							// _this.set_school(this_school);
							if(_this.faculties.length >= _this.faculties_final.length

								){
								_this.save_school();
								_this.log_test('- save school database : '+_this.school);
								// _this.log_test('- save school database : '+this_school.faculty_final.toString());
								// save_tothis_school.save_to &&
								// this_school.save_to = false;
								// _this.set_school(this_school);
								// _this.save_school_database(this_school.school);
							}
						}
					});
				} 
					//return next(new Error('Failed to load Faculty ' + id));
				
				//req.faculty = faculty ;
				//next();
			});
			
		}
	},
	//save to database
	save_school : function  () {
		var _this = this
		//console.log('save_school');
		//var this_school = this.get_school(school_code);
		//var _this = this;
		//this_school.faculty_final = [];
		//this.log(school_code,'- save school database');
		School
		.findOne({code : _this.school})
		.exec(function(err, school) {
			if (err) {
				// _this.log(school_code,err.toString());
				// _this.res.jsonp({
				// 	result:false, 
				// 	message:err.toString()
				// });
			}else{
				// _this.log(school_code,'- save school success');
				//school.faculty_list = _.pluck(faculties, 'code');
				//school.quota = this_school.total_quota;
				//school.status = 1;
				//school.resume = this_school.resume;
				//school.matriculated = this_school.matriculated;
				//school.candidate = this_school.candidate_all;
				// var benchmark = _.pluck(this_school.faculty_choice, 'benchmark');
				// if(benchmark.length > 0){
				// 	var benchmark_sort = _.sortBy(benchmark);
				// 	school.largest_benchmark = benchmark_sort[benchmark_sort.length-1];
				// 	school.smallest_benchmark = benchmark_sort[0];
				// }
				school.modified = Date();				
				school.save(function(err, result) {
					if (err) {
						_this.log(err.toString());
						_this.res.jsonp({
							result:false, 
							message:err.toString()
						});
					} else {
						_this.log('- save school success final');
						_this.res.jsonp({
							result:true, 
							message:''
						});
						// return
					}
				});
			}
		});
	}
	//min_benchmark();
	// body...
}