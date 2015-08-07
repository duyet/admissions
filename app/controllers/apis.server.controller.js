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


exports.matriculate = function(req, res) {
	var school_code = 'QSC';
	matriculate.run_matriculate(school_code);	
};
var matriculate_list = [];
var log_faculty = "/home/eroshaly/admissions/log_matriculate/candidates_faculty.txt";
var log_result_matriculate = "/home/eroshaly/admissions/log_matriculate/candidates_result_matriculate.txt";
var log_candidates_same = "/home/eroshaly/admissions/log_matriculate/candidates_same.txt";
var log_check_same = "/home/eroshaly/admissions/log_matriculate/candidates_check_same.txt";
var log_error = "/home/eroshaly/admissions/log_matriculate/candidates_error.txt";
var log_candidates = "/home/eroshaly/admissions/log_matriculate/candidates_log.txt";
//var fs = require('fs');
var matriculate = {
	run_matriculate : function (school) {
		console.log('\n\n - Start School ['+school+']');

		require('fs').unlink(log_faculty);
		require('fs').unlink(log_result_matriculate);
		require('fs').unlink(log_candidates_same);
		require('fs').unlink(log_check_same);
		require('fs').unlink(log_error);
		require('fs').unlink(log_candidates);

		require('fs').writeFile(log_faculty,(Date())+' \n');
		require('fs').writeFile(log_result_matriculate,(Date())+' \n');
		require('fs').writeFile(log_candidates_same,(Date())+' \n');
		require('fs').writeFile(log_check_same,(Date())+' \n');
		require('fs').writeFile(log_error,(Date())+' \n');
		require('fs').writeFile(log_candidates,(Date())+' \n');

		this.init_matriculate(school);
	},
	init_data_faculty: function (school_code) {
		console.log('\n\n - init init data faculty ['+school_code+']' +(Date())+' \n');
		var _this = this;
		var this_school = _this.get_school(school_code);
		//console.log(this_school);
			Candidate.find({
				school_code: school_code,
			})
			.exec(function(err, candidates) {
				if (err) {

				}else{
					var candidate_all = _.uniq(candidates, 'student_id');
					require('fs').appendFile(log_candidates,'\n['+candidate_all.length+'] candidate For '+school_code+'\n');
					this_school.candidate_all = candidate_all;
					for(var s_index in this_school.faculty_choice){
						var faculty_current = this_school.faculty_choice[s_index];
						var faculty_candidate = get_faculty_same(candidates, this_school.faculty_choice[s_index].code);
						for(var c_index in faculty_candidate){
							if(faculty_current.candidate_apply.indexOf(faculty_candidate[c_index].student_id) === -1){
								faculty_current.candidate_apply.push(faculty_candidate[c_index].student_id);
							}
						}
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
		console.log('\n\n - init matriculate ['+school+']' +(Date())+' \n');
		var current_school = {};
		var create = true;
		for(var x_index in matriculate_list){
			//---Find school
			if(matriculate_list[x_index].school 
			=== school){
				current_school = matriculate_list[x_index];
				create = false;
				this.init_data_faculty(current_school);
				break;
			}
		}
		if(create){
			var faculty_choice = [];
			var total_quota = 0;
			//'==========>Init Matriculate<===========''
			for(var x in facultyFull){
				if(facultyFull[x].school_code === school){
					//'==========>Add Faculty <===========';
					facultyFull[x].matriculated = false;
					faculty_choice.push(facultyFull[x]);
					total_quota += facultyFull[x].quota;
				}
			}

			current_school = {
				school: school,
				faculty_choice: faculty_choice,
				total_quota : total_quota,
				matriculated_list : [],
				faculty_matriculated : [],
				faculty_filter : [],
				has_candidate : [],
				faculty_final : [],
				candidate_all: []
			};
			
			matriculate_list.push(current_school);
			this.init_data_faculty(current_school.school);
		}
	},
	//create matriculate list function
	create_matriculate_list: function (school_code) {
		var _this = this;
		var this_school = _this.get_school(school_code);
		this_school.faculty_matriculated = [];
		console.log('\n- create matriculate list for School ['+school_code+']' + ' - ' +(Date())+' \n');


		require('fs').appendFile(log_faculty,'\n-create matriculate list for School For '+school_code+ '-' +(Date()));	
		require('fs').appendFile(log_result_matriculate, '\n -------- Matriculate School ['+school_code+'] ---------- \n'+'\n Times:  '+(Date())+' \n');
		//require('fs').appendFile(log_result_matriculate, school_code+'] ---------- \n');
		//require('fs').appendFile(log_result_matriculate, '\n Times:  '+(Date())+' \n');
		//console.log( '\n\n - Query Candidate for School '+school_code);
		//require('fs').appendFile(log_faculty, '\n\n - Query Candidate for School '+school_code);
		Candidate.find({
			school_code: school_code,
			student_id : { '$nin': this_school.has_candidate }
		})
		.sort('-score_sum')
		.exec(function(err, candidates) {

			if (err) {
				//console.log('\n\n - Query Faculty ['+x +']'+this_school.faculty_choice[x].code);
				console.log('\n\n - Query Faculty But ERROR - '+this_school.faculty_choice[x].code, err);
				//require('fs').appendFile(log_error, err.toString());
			} else {
				
				if(candidates.length > 0){
					//var candidate = candidates[0];

					for(var y_index in this_school.faculty_choice){

						//----Find faculty
						var candidate_choice = get_faculty_same(candidates, 
							this_school.faculty_choice[y_index].code);

						if(this_school.faculty_choice[y_index].quota > this_school.faculty_choice[y_index].current
							&& candidate_choice.length > 0

						){
							var faculty_current = this_school.faculty_choice[y_index];											
							
							candidate_choice.sort(compare_faculty_candidate_priority);
							var candidate_chunk =  _.chunk(candidate_choice, 
									this_school.faculty_choice[y_index].quota - this_school.faculty_choice[y_index].current);
							var faculty_candidate = candidate_chunk[0];

							faculty_current.current += faculty_candidate.length;											
							faculty_current.matriculate_list = faculty_current.matriculate_list.concat(faculty_candidate);
							faculty_current.benchmark = faculty_current.matriculate_list[faculty_current.matriculate_list.length -1].score_sum

							//-----Working faculty													
							// require('fs').appendFile(log_result_matriculate, 
							// 	'\n-Faculty: '+faculty_current.code +
							// 	'-More: '+faculty_candidate.length +
							// 	'-Benchmark: '+faculty_candidate[faculty_candidate.length -1].score_sum +' \n');

							this_school.faculty_choice[y_index] = faculty_current;

							this_school.matriculated_list = this_school.matriculated_list.concat(faculty_candidate);
							_this.set_school(this_school);
						}else{
							this_school.faculty_final.push(this_school.faculty_choice[y_index].code);
							_this.set_school(this_school);
						}
					}
					_this.remove_candidates_same(this_school.school);	
				}else{
					_this.remove_candidates_same(this_school.school);	
				}				
			}
		});
	},
	//remove candidates same function
	remove_candidates_same: function  (school_code) {
		var this_school = this.get_school(school_code);
		console.log('\n- remove candidates same for School ['+this_school.school+']' +(Date())+' \n');
		
		var candidates = this_school.matriculated_list;	
		var list_same = [];
		var list_keep = [];

		for(var x_index in candidates){	

			var same = get_candidates_same(candidates, candidates[x_index].student_id);
			if(same.length > 1){
				same.sort(compare_candidate_priority);
				list_keep.push(same[0]);						
				same.shift();
				list_same = list_same.concat(same);
			}
		}
		for(var x_index in list_same){
			for(var y_index in candidates){
				if(candidates[y_index]._id === list_same[x_index]._id){
					candidates.splice(y_index, 1);
				}
			}
		}
		for(var x_index in candidates){
			this_school.has_candidate.push(candidates[x_index].student_id);
		}
		this_school.faculty_filter = candidates;
		//require('fs').appendFile(log_result_matriculate, '\n Times:  '+(Date())+' \n');

		for(var y_index in this_school.faculty_choice){
			var faculty_candidate = get_faculty_same(candidates, this_school.faculty_choice[y_index].code);
				faculty_candidate.sort(compare_faculty_candidate_priority);

				// require('fs').appendFile(log_result_matriculate, 
				// 	'\n-Faculty: '+this_school.faculty_choice[y_index].code +
				// 	'-Current: '+faculty_candidate.length +
				// 	'-Benchmark: '+faculty_candidate[faculty_candidate.length -1].score_sum +' \n');
				
			var faculty_current = this_school.faculty_choice[y_index];

				faculty_current.current = faculty_candidate.length;
				faculty_current.benchmark = faculty_candidate[faculty_candidate.length -1].score_sum
				faculty_current.matriculate_list = faculty_candidate;

				this_school.faculty_choice[y_index] = faculty_current;
		}
		console.log('Final School check - ',this_school.faculty_final.length,this_school.faculty_choice.length )
		if(this_school.faculty_final.length >= this_school.faculty_choice.length 
			|| this_school.candidate_all.length === candidates.length){
			console.log('\n\n - Final School ['+this_school.school +']');
			//require('fs').appendFile(log_faculty, '\n\n - Final School ['+this_school.school +']');
			return;
		}else{
			this.create_matriculate_list(this_school.school);
		}

	}
}

function get_candidates_same (list, value) {
	var result  = list.filter(function(item){return item.student_id == value;} );
	return result ? result : []; // or undefined
}

function get_faculty_same (list, value) {
	var result  = list.filter(function(item){return item.faculty_code == value;} );
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
