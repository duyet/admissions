'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Candidate = mongoose.model('Candidate'),
	School = mongoose.model('School'),
	Faculty = mongoose.model('Faculty'),
	_ = require('lodash');

/**
 * Create a Api
 */
exports.create = function(req, res) {
	var api = new Api(req.body);
	api.user = req.user;

	api.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(api);
		}
	});
};

/**
 * Show the current Api
 */
exports.read = function(req, res) {
	res.jsonp(req.api);
};

/**
 * Update a Api
 */
exports.update = function(req, res) {
	var api = req.api ;

	api = _.extend(api , req.body);

	api.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(api);
		}
	});
};

/**
 * Delete an Api
 */
exports.delete = function(req, res) {
	var api = req.api ;

	api.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(api);
		}
	});
};

/**
 * List of Apis
 */
exports.list = function(req, res) { 
	Api.find().sort('-created').populate('user', 'displayName').exec(function(err, apis) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(apis);
		}
	});
};

/**
 * Api middleware
 */
exports.apiByID = function(req, res, next, id) { 
	// Api.findById(id).populate('user', 'displayName').exec(function(err, api) {
		// if (err) return next(err);
		// if (! api) return next(new Error('Failed to load Api ' + id));
		req.api.id = id ;
		next();
	// });
};

/**
 * Api authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.api.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

/**
 * Query of Apis
 */
var facultyFull;
 Faculty.find().exec(function(err, faculty) {
	////console.log(err, faculty);
	facultyFull = faculty;
});
var schoolAll;
School.find().exec(function(err, school) {
	schoolAll = school ;
});
exports.query = function(req, res) { 
	// create_faculty_list();

	var subject1 = req.body.subjectgroup.subject1
	var subject2 = req.body.subjectgroup.subject2
	var subject3 = req.body.subjectgroup.subject3

	var shuffle = shuffle_func(subject1, subject2, subject3);

	for (var i in facultyFull) {
		// var facultyFull
		var faculty = facultyFull[i];
		Candidate.aggregate([
		    { $project: {
		    	student_name:1,
		    	student_id:1,
		    	school_code:1,
		    	faculty_code:1,
		    	subject_group: 1,
		    	priority: 1,		    	
		        score_sum: 1,
		        score_priority: 1,
		        score_total: {$add: ['$score_sum', '$score_priority']}}},

		    // Filter the docs to just those where sum < 20
		    { $match: {
		    	school_code: {$eq : faculty.school_code} , 
		    	faculty_code: {$eq : faculty.code}  ,
		    	score_total: {$gte: req.body.score.score_sum}
		    }},
		    //{ $limit : facultyFull[i].quota },
		    //{ $sort : { score_total : -1} }

		], function(err, result) {
			// if(result.length > 0){
			// 	faculty.matriculate_list = result;
			// 	////console.log(facultyFull[i]);
			// 	faculty.save(function(err) {
			// 		if (err) {
			// 			//console.log(err);
			// 		} else {
			// 		//	//console.log(facultyFull[i]);
			// 		}
			// 	});
			// }
			//if (result[0]) //console.log("============> ", faculty, " ==> ", result[0]);
		});
	};

	// create_matriculate_list(req.body.score);
	// Faculty.find({
	// 	subject_group: { $in: shuffle },
		
	// }).exec(function(err, facultys) {
	// 	if (err) {
	// 		return res.status(400).send({
	// 			message: errorHandler.getErrorMessage(err)
	// 		});
	// 	} else {

	// 		//res.jsonp(facultys); subject_group: { $in: shuffle },

	// 		var shuffle_facultys = [];
	// 		for (var i in facultys) {
	// 			shuffle_facultys.push(facultys[i].school_code + '-' + facultys[i].code);
	// 		}
	
	// 		//console.log(shuffle_facultys);
	// 				Candidate.aggregate(
	// 		  		{ $match : {school_faculty : {$in : shuffle_facultys},  score_sum: { $gt: req.body.score.score_sum  } } }
	// 			  , 
	// 			  { $group: { _id: { school_code:  "$school_code" , faculty_code:  "$faculty_code" } , total: { $sum: 1}}}
	// 			  , { $project: { _id: 1, total: 1 , school_faculty: { $concat: [ "$_id.school_code", "-", "$_id.faculty_code" ] }}}
	// 			  //, { $project: { itemDescription: { $concat: [ "$item", " - ", "$description" ] } } }
	// 			  , function (err, logs) {
	// 			  	if (err) {
	// 				  	//console.log(err);
	// 					return res.status(400).send({
	// 						message: errorHandler.getErrorMessage(err)
	// 					});
	// 				} else {

	// 					var school = [];
	// 					for (var i in logs) {

	// 						for (var x = 0; 
	// 							x < facultyFull.length && (
	// 								facultyFull[x].code !== logs[i]._id.faculty_code 
	// 								&& facultyFull[x].school_code !== logs[i]._id.school_code
	// 								); x++) {};
								
	// 						if(facultyFull[x] === undefined){
	// 							//console.log(logs[i]);
	// 						}
	// 						if(facultyFull[x] !== undefined && parseInt(logs[i].total) < parseInt(facultyFull[x].quota)){
	// 							logs[i].faculty = facultyFull[x];
	// 							// for (var x = 0; x < schoolAll.length && schoolAll[x].code !== logs[i]._id.school_code; x++) {};
	// 							// logs[i].school = schoolAll[x];
	// 							school.push(logs[i]);
	// 						}
							
	// 					};
	// 					res.jsonp(school);
	// 				}
	// 			});
	// 	}
	// });

	// Candidate.aggregate()
	//   .group({ _id: "$school_code", total: { $sum: 1 } })
	//   .select('-id total')
	//   .exec(function (err, logs) {
	//     // if (err) return handleError(err);
	//     // //console.log(res); // [ { maxBalance: 98 } ]
	//     if (err) {
	// 		return res.status(400).send({
	// 			message: errorHandler.getErrorMessage(err)
	// 		});
	// 	} else {
	// 		res.jsonp(logs);
	// 	}
	// });
		
	
};

function shuffle_func (subject1, subject2, subject3) {
	var shuffle = [];
	shuffle.push(subject1+'-'+subject2+'-'+subject3);
	shuffle.push(subject1+'-'+subject3+'-'+subject2);
	shuffle.push(subject2+'-'+subject1+'-'+subject3);
	shuffle.push(subject2+'-'+subject3+'-'+subject1);
	shuffle.push(subject3+'-'+subject1+'-'+subject2);
	shuffle.push(subject3+'-'+subject2+'-'+subject1);
	return shuffle;	
};


/**
 * matriculate a Api
 */


// Candidate.aggregate(
//   		{ $match : {school_faculty : {$in : shuffle_facultys},  score_sum: { $gt: req.body.score.score_sum  } } }
// 	  , 
// 	  { $group: { _id: { school_code:  "$school_code" , faculty_code:  "$faculty_code" } , total: { $sum: 1}}}
// 	  , { $project: { _id: 1, total: 1 , school_faculty: { $concat: [ "$_id.school_code", "-", "$_id.faculty_code" ] }}}
// 	  //, { $project: { itemDescription: { $concat: [ "$item", " - ", "$description" ] } } }
// 	  , function (err, logs) {
// 	  	if (err) {
// 		  	//console.log(err);
// 			return res.status(400).send({
// 				message: errorHandler.getErrorMessage(err)
// 			});
// 		} else {
exports.domatriculate = function(req, res) {
	if(_.has(req.body, 'school')){
		matriculate.run_matriculate(req.body.school, res);
	}else{
		res.jsonp({
			result:false, 
			message:'Quá trình xử lý có một vấn đề. Vui lòng thử lại sau!'
		});
	}
	//school
}
exports.viewschool = function(req, res) {
	if(_.has(req.body, 'school')){
		Faculty
		.find({school_code : req.body.school})
		.exec(function(err, faculties) {
			if (err) {
				res.jsonp({
					result:false, 
					message:err.toString()
				});
			} else {
				res.jsonp({
					result:true, 
					record: faculties,
					message:''
				});
			}
		});
	}else{
		res.jsonp({
			result:false, 
			message:'Quá trình xử lý có một vấn đề. Vui lòng thử lại sau!'
		});
	}
	//school
}
exports.viewfaculty = function(req, res) {
	if(_.has(req.body, 'school')){
		Faculty
		.find({school_code : req.body.school},{candidate_apply:0, candidate_check: 0, school_name : 0})
		.exec(function(err, faculties) {
			if (err) {
				res.jsonp({
					result:false, 
					message:err.toString()
				});
			} else {
				for(var x_index in faculties){
					faculties[x_index].matriculate = _.size(faculties[x_index].matriculate_list);//.length
					faculties[x_index].candidate = _.size(faculties[x_index].candidate_apply);//.length
				}
				res.jsonp({
					result:true, 
					record: faculties,
					message:''
				});
			}
		});
	}else{
		res.jsonp({
			result:false, 
			message:'Quá trình xử lý có một vấn đề. Vui lòng thử lại sau!'
		});
	}
	//school
}
exports.findcandidates = function(req, res) {
	//if(_.has(req.body, 'school')){
		Candidate
		.find({'$and' : [{faculty_code:{'$ne' : null}},{faculty_code:{'$ne' : ""}}]},{score_1:0, score_2: 0, score_3 : 0})
		.limit(50)
		.sort('-score_sum')
		.exec(function(err, faculties) {
			if (err) {
				res.jsonp({
					result:false, 
					message:err.toString()
				});
			} else {
				// for(var x_index in faculties){
				// 	faculties[x_index].matriculate = _.size(faculties[x_index].matriculate_list);//.length
				// 	faculties[x_index].candidate = _.size(faculties[x_index].candidate_apply);//.length
				// }
				res.jsonp({
					result:true, 
					record: faculties,
					message:''
				});
			}
		});
	// }else{
	// 	res.jsonp({
	// 		result:false, 
	// 		message:'Quá trình xử lý có một vấn đề. Vui lòng thử lại sau!'
	// 	});
	// }
	//school
}
exports.matriculate = function(req, res) {
	var school_code = 'QSC';
	Candidate.aggregate( [ 
		{ $match : {school_code : 'DDK'}},
		{ $group : { _id : {faculty_code:  "$faculty_code", } } } ,
		{ $project: { _id: 1, school_code:1, faculty_code: "$_id.faculty_code"}},
		], 
		function (err, logs) {
	//{ $group: { _id: { school_code:  "$school_code" , faculty_code:  "$faculty_code" } , total: { $sum: 1}}}
	// 			  , { $project: { _id: 1, total: 1 , school_faculty: { $concat: [ "$_id.school_code", "-", "$_id.faculty_code" ] }}}
	// 			  
	  	if (err) {//faculty_code:  "$faculty_code", faculty:  "$faculty"
		  	console.log(err);
			// return res.status(400).send({
			// 	message: errorHandler.getErrorMessage(err)
			// });
		} else {
			console.log(_.pluck(logs, 'faculty_code'));
			
		}
	}
	);
	
};
var matriculate_list = [];

var matriculate = {
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
		require('fs').unlink(this.log_file+school_code+".txt");
		require('fs').writeFile(this.log_file+school_code+".txt",(Date())+' \n');
		require('fs').unlink(this.log_file+school_code+"_test.txt");
		require('fs').writeFile(this.log_file+school_code+"_test.txt",(Date())+' \n');
	},
	run_matriculate : function (school, res) {
		this.res = res;
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
		var faculty_choice =  _.uniq(_.filter(facultyFull, function(object) {
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
// function create_matriculate (score) {
// 	for (var i in facultyFull) {
// 		Candidate.aggregate(
			
// 		    // { $group: { _id: { school_code:  "$school_code" , faculty_code:  "$faculty_code" } , total: { $sum: 1}}},
// 			{ $project: { score_total: { $sum: { $multiply: [ "$score_sum", "$score_priority" ] } },}},//	
// 			{ $match : {score_total: { $gte: req.body.score.score_sum  } } },   
// 				  //, { $project: { itemDescription: { $concat: [ "$item", " - ", "$description" ] } } }
// 			function (err, logs) {
// 				  	if (err) {
// 					  	//console.log(err);
// 						return res.status(400).send({
// 							message: errorHandler.getErrorMessage(err)
// 						});
// 					} else {

// 						res.jsonp(logs);
// 					}
// 				});
// 	};

// }
// function create_faculty_list () {
// 	for (var i in schoolAll) {
// 		School.findById(schoolAll[i]._id).exec(function(err, school) {
// 		Faculty.find({school_code : school.code}).exec(function(err, faculty) {
// 			var faculty_list = [];
// 				for (var x in faculty) {
// 					faculty_list.push(faculty[x]._id);
// 				}
// 			school.faculty_list = faculty_list;
// 			school.save(function(err) {
// 			});
// 		});
// 	});
// 	};
// }