function matriculate_do (school, res) {
	this.res = res;
	this.school_code = school;
	this.school = {};
	this.log_file = "/home/eroshaly/admissions/log_matriculate/matriculate_log_"+this.school_code+".txt"
	console.log('\n\n - Start School ['+school+']');
	this.init_log();
	this.init_matriculate(school);
}
// export the class
module.exports = matriculate_do;
	// body...

	// this.matriculate = {
	matriculate_do.prototype.run_matriculate = function (school, res) {
		this.res = res;
		this.school_code = school;
		this.school = {};
		this.log_file = "/home/eroshaly/admissions/log_matriculate/matriculate_log_"+this.school_code+".txt"
		console.log('\n\n - Start School ['+school+']');
		this.init_log();
		this.init_matriculate(school);
	};//,
	matriculate_do.prototype.log = function (message) {
			console.log(' \n [' +(Date()) + ']' + message);
			require('fs').appendFile(log_candidates,' \n [' +(Date()) + ']' + message);
		};
	matriculate_do.prototype.init_log = function (school) {
			//var log_file = "/home/eroshaly/admissions/log_matriculate/matriculate_log_"+this.school_code+".txt"
			require('fs').unlink(this.log_file);
			require('fs').writeFile(this.log_file,(Date())+' \n');
		};
	matriculate_do.prototype.init_data_faculty = function () {
			var _this = this;
			this.log('\n\n - init init data faculty ['+_this.school_code+'] \n');
			
			////var _this.school = this.school;//_this.get_school(school_code);
			//console.log(_this.school);
				Candidate.find({
					school_code: _this.school_code,
				})
				.exec(function(err, candidates) {
					if (err) {

					}else{
						_this.school.resume = candidates.length;
						var candidate_all = _.uniq(candidates, 'student_id');
						_this.log('['+candidate_all.length+'] candidate For '+_this.school_code);
						//require('fs').appendFile(log_candidates,'['+candidate_all.length+'] candidate For '+school_code+'\n');
						//require('fs').appendFile(log_candidates,_.pluck(candidate_all, 'student_id'));
						_this.school.candidate_all = candidate_all.length;
						for(var s_index in _this.school.faculty_choice){
							var faculty_current = _this.school.faculty_choice[s_index];
							var faculty_candidate = get_faculty_same(candidates, _this.school.faculty_choice[s_index].code);
							faculty_current.candidate_apply = faculty_candidate.length;//_.pluck(faculty_candidate, 'student_id');
						}
						//_this.set_school(_this.school.school);
						_this.create_matriculate_list();											
						}
				});
		};
		// //get school function
		// get_school : function (school) {
		// 	for(var x_index in matriculate_list){
		// 		if(matriculate_list[x_index].school 
		// 		=== school){
		// 			return matriculate_list[x_index];
		// 		}
		// 	}
		// 	return null;
		// },//set school function
		// set_school : function (school_object) {
		// 	for(var x_index in matriculate_list){
		// 		if(matriculate_list[x_index].school 
		// 		=== school_object.school){
		// 			matriculate_list[x_index] = school_object;
		// 		}
		// 	}
		// },
		//init matriculate function
	matriculate_do.prototype.init_matriculate = function (school) {
			var _this = this;
			console.log('\n\n - init matriculate ['+school+']' +(Date())+' \n');
			var faculty_choice = _.filter(facultyFull, function(object) {
					  return object.school_code === school;
					});
			var total_quota = _.sum(faculty_choice, function(object) {
										  return object.quota;
										});
			_this.school = {
					school: school,
					faculty_choice: faculty_choice,
					total_quota : total_quota,
					matriculated_list : [],
					// faculty_matriculated : [],
					// faculty_filter : [],
					has_candidate : [],
					faculty_final : [],
					candidate_all: 0,
					resume : 0,
					matriculated : 0
				};
			//var create = true;
			// for(var x_index in matriculate_list){
			// // 	---Find school
			// 	if(matriculate_list[x_index].school 
			// 	=== school){
			// 		matriculate_list[x_index] = current_school;
			// 		create = false;
			// 		break;
			// 	}
			// }
			// if(create){
			// 	matriculate_list.push(current_school);			
			// }
			this.init_data_faculty();
		};
		//create matriculate list function
	matriculate_do.prototype.create_matriculate_list = function (school_code) {
			var _this = this;
			//var _this.school = _this.get_school(school_code);

			console.log('\n- create matriculate list for School ['+school_code+']' + ' - ' +(Date())+' \n');
			require('fs').appendFile(log_faculty,'\n-create matriculate list for School For '+school_code+ '-' +(Date()));	
			
			require('fs').appendFile(log_result_matriculate, '\n -------- Matriculate School ['+school_code+'] ---------- \n'+'\n Times:  '+(Date())+' \n');
			
			Candidate.find({
				school_code: school_code,
				student_id : { '$nin': _this.school.has_candidate }
			})
			.sort('-score_sum')
			.exec(function(err, candidates) {

				if (err) {
					//console.log('\n\n - Query Faculty ['+x +']'+_this.school.faculty_choice[x].code);
					console.log('\n\n - Query Faculty But ERROR - '+_this.school.faculty_choice[x].code, err);
					//require('fs').appendFile(log_error, err.toString());
				} else {
					
					if(candidates.length > 0){
						//var candidate = candidates[0];

						for(var y_index in _this.school.faculty_choice){

							//----Find faculty
							var candidate_choice = get_faculty_same(candidates, 
								_this.school.faculty_choice[y_index].code);

							if(_this.school.faculty_choice[y_index].quota >= 
								_this.school.faculty_choice[y_index].current
								&& candidate_choice.length > 0

							){
								var faculty_current = _this.school.faculty_choice[y_index];											
								
								candidate_choice.sort(compare_faculty_candidate_priority);
								var candidate_chunk =  _.chunk(candidate_choice, 
										_this.school.faculty_choice[y_index].quota - _this.school.faculty_choice[y_index].current);
								var faculty_candidate = candidate_chunk[0];

								faculty_current.current += faculty_candidate.length;											
								faculty_current.matriculate_list = faculty_current.matriculate_list.concat(faculty_candidate);
								if(faculty_candidate.length > 0){
									faculty_current.benchmark = faculty_current.matriculate_list[faculty_current.matriculate_list.length -1].score_sum
								}
								// -----Working faculty													
								require('fs').appendFile(log_result_matriculate, 
									'\n-Faculty: '+faculty_current.code +
									'-More: '+faculty_candidate.length +
									'-Benchmark: '+faculty_current.benchmark +' \n');

								_this.school.faculty_choice[y_index] = faculty_current;

								_this.school.matriculated_list = _this.school.matriculated_list.concat(faculty_candidate);
								_this.set_school(_this.school);
							}
							if(_this.school.faculty_choice[y_index].quota <= 
								_this.school.faculty_choice[y_index].current
								&& _this.school.faculty_final.indexOf(_this.school.faculty_choice[y_index].code) === -1
								){
								_this.school.faculty_final.push(_this.school.faculty_choice[y_index].code);
								_this.set_school(_this.school);
							}
						}
						_this.remove_candidates_same(_this.school.school);	
					}else{
						_this.remove_candidates_same(_this.school.school);	
					}				
				}
			});
		};
		//remove candidates same function
	matriculate_do.prototype.remove_candidates_same = function  (school_code) {
			var _this = this;
			//var _this.school = this.get_school(school_code);
			
			console.log('\n- remove candidates same for School ['+_this.school.school+']' +(Date())+' \n');
			require('fs').appendFile(log_faculty,'\n- remove candidates same for School ['+_this.school.school+']' +(Date())+' \n');	
			require('fs').appendFile(log_result_matriculate, '\n -------- remove candidates same for School ['+school_code+'] ---------- \n'+'\n Times:  '+(Date())+' \n');
			
			var candidates = _this.school.matriculated_list;	
			var list_same = [];
			//var list_keep = [];

			// var earlierMatch  = (elt, index, candidates) => array.indexOf(elt) !== index;
			// var hasDuplicates = array => _.some(candidates, earlierMatch);
			var candidate_uniq = _.uniq(candidates, 'student_id');
			
			// console.log('candidate_uniq', candidates.length);
			for(var x_index in candidate_uniq){
				var same = get_candidates_same(candidates, candidate_uniq[x_index].student_id);
				if(same.length > 1){
					same = _.sortBy(same, 'priority')
					// same.sort(compare_candidate_priority);
					//list_keep.push(same[0]);						
					same.shift();
					var pluck_same = _.pluck(same, '_id');
					list_same = list_same.concat(pluck_same);//.concat(pluck_same);
					//console.log('pluck_same',pluck_same.length, list_same.length);
					//list_same.concat(same);
				}
			}
			

			var candidates_matriculated = _.remove(candidates, function(object) {
				//console.log('candidates_matriculated', object._id, list_same.indexOf(object._id))
				return list_same.indexOf(object._id) == -1;
			});
			console.log('\n - candidate_uniq', 
				'uniq',candidate_uniq.length, 
				'candidates',candidates.length, 
				'list_same',list_same.length,
				'candidates_matriculated', candidates_matriculated.length);
			//console.log('candidates_matriculated', candidates_matriculated.length);
			// candidates = candidates_matriculated;
			// for(var x_index in list_same){
			// 	for(var y_index in candidates){
			// 		if(candidates[y_index]._id === list_same[x_index]._id){
			// 			candidates.splice(y_index, 1);
			// 		}
			// 	}
			// }
			_this.school.has_candidate = _this.school.has_candidate.concat(_.pluck(candidates_matriculated, 'student_id'));
			// for(var x_index in candidates){
			// 	_this.school.has_candidate.push(candidates[x_index].student_id);
			// }
			// _this.school.faculty_filter = candidates_matriculated;
			//require('fs').appendFile(log_result_matriculate, '\n Times:  '+(Date())+' \n');

			for(var y_index in _this.school.faculty_choice){
				var faculty_candidate = get_faculty_same(candidates_matriculated, _this.school.faculty_choice[y_index].code);
					faculty_candidate.sort(compare_faculty_candidate_priority);
					faculty_candidate = _.sortBy(faculty_candidate, 'score_sum');
					
					
				var faculty_current = _this.school.faculty_choice[y_index];

					faculty_current.current = faculty_candidate.length;
					// console.log(faculty_candidate.length);
					if(faculty_candidate.length > 0){
						faculty_current.benchmark = faculty_candidate[faculty_candidate.length -1].score_sum
					}
					require('fs').appendFile(log_result_matriculate, 
						'\n-Faculty: '+_this.school.faculty_choice[y_index].code +
						'-Current: '+faculty_candidate.length +
						'-Benchmark: '+faculty_current.benchmark +' \n');

					faculty_current.matriculate_list = faculty_candidate;

					_this.school.faculty_choice[y_index] = faculty_current;
			}
			console.log('Final School check - ',
				'faculty_final - ',_this.school.faculty_final.length,
				'faculty_choice - ',_this.school.faculty_choice.length ,
				'candidate_all - ',_this.school.candidate_all,
				'candidates - ',candidates.length
				)
			_this.school.matriculated = candidates.length;
			this.set_school(_this.school);
			if(_this.school.faculty_final.length >= _this.school.faculty_choice.length 
				|| _this.school.candidate_all === candidates.length){

				if(candidates.length > 0){
					this.save_to_database(_this.school.school);
				}else{
					_this.res.jsonp({
						result:true, 
						message:''
					});
				}
				

				console.log('\n\n - Final School ['+_this.school.school +']');
				require('fs').appendFile(log_faculty,'\n\n - Final School ['+_this.school.school +']');	
				
				
				// require('fs').appendFile(log_faculty, '\n\n - Final School ['+_this.school.school +']');
				//return;
			}else{
				this.create_matriculate_list(_this.school.school);
			}

		};
		//save to database
	matriculate_do.prototype.save_to_database = function (school_code) {
			//var _this.school = this.get_school(school_code);
			var _this = this;
			_this.school.faculty_final = [];
			Faculty
			.find({school_code : school_code})
			.exec(function(err, faculties) {
				if (err) {
					console.log(err);
					// return res.status(400).send({
					// 	message: errorHandler.getErrorMessage(err)
					// });
				} else {
					for(var f_index in faculties){
						for(var s_index in _this.school.faculty_choice){
							if(faculties[f_index].code === _this.school.faculty_choice[s_index].code){
								faculties[f_index] = _this.school.faculty_choice[s_index];
								faculties[f_index].save(function(err, faculty) {
									if (err) {
										console.log(err);
										require('fs').appendFile(
											"/home/eroshaly/admissions/log_matriculate/save_to_database.txt",
											'\n' +err.toString()
										);
										// if(_this.school.faculty_final.indexOf(faculty.code) === -1){
										// 	_this.school.faculty_final.push(faculty.code);
										// }
										// if(_this.school.faculty_final.length >= _this.school.faculty_choice.length){
										// 	// return
										// 	// res.jsonp({
										// 	// 		result:true, 
										// 	// 		message:''
										// 	// 	});
										// 	_this.save_school_database(_this.school.school);
										// }
									} else {
										console.log('Save -'+faculty.school_code + ' - ' + faculty.code + ' - ' + Date());
										require('fs').appendFile(
											"/home/eroshaly/admissions/log_matriculate/save_to_database.txt",
											'\n'+faculty.school_code + ' - ' + faculty.code + ' - ' + Date()
										);
										if(_this.school.faculty_final.indexOf(faculty.code) === -1){
											_this.school.faculty_final.push(faculty.code);
										}
										
										if(_this.school.faculty_final.length >= _this.school.faculty_choice.length){
											// return
											// _this.res.jsonp({
											// 		result:true, 
											// 		message:''
											// 	});
											_this.save_school_database(_this.school.school);
										}
									}
								});
							}
						}
					}
					//res.jsonp(faculties);
				}
			});
		};
		//save to database
	matriculate_do.prototype.save_school_database = function (school_code) {
			//var _this.school = this.get_school(school_code);
			var _this = this;
			//_this.school.faculty_final = [];
			School
			.findOne({code : school_code})
			.exec(function(err, school) {
				if (err) {
					console.log(err);
					_this.res.jsonp({
						result:false, 
						message:err.toString()
					});
				}else{
					
					school.faculty_list = _.pluck(_this.school.faculty_choice, 'code');
					school.quota = _.sum(_this.school.faculty_choice, function(object) {
											  return object.quota;
											});
					school.status = 1;
					school.resume = _this.school.resume;
					school.matriculated = _this.school.matriculated;
					school.candidate = _this.school.candidate_all.length;
					// school.largest_benchmark
					// school.smallest_benchmark = benchmark[0];
					var benchmark = _.pluck(_this.school.faculty_choice, 'benchmark');
					if(benchmark.length > 0){
						var benchmark_sort = _.sortBy(benchmark);
						school.largest_benchmark = benchmark_sort[benchmark_sort.length-1];
						school.smallest_benchmark = benchmark_sort[0];
					}
					school.modified = Date();
					// if(_.isEmpty(school.created)){
					// 	school.created = Date();
					// }
					
					
					school.save(function(err, result) {
						if (err) {
							console.log(err);
							_this.res.jsonp({
								result:false, 
								message:err.toString()
							});
						} else {
							_this.res.jsonp({
								result:true, 
								message:''
							});
						}
					});
				}
			});
		};
	//};
	//matriculate_do.prototype.run_matriculate(school, res);
//};