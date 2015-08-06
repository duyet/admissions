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
	//console.log(err, faculty);
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
			// 	//console.log(facultyFull[i]);
			// 	faculty.save(function(err) {
			// 		if (err) {
			// 			console.log(err);
			// 		} else {
			// 		//	console.log(facultyFull[i]);
			// 		}
			// 	});
			// }
			if (result[0]) console.log("============> ", faculty, " ==> ", result[0]);
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
	
	// 		console.log(shuffle_facultys);
	// 				Candidate.aggregate(
	// 		  		{ $match : {school_faculty : {$in : shuffle_facultys},  score_sum: { $gt: req.body.score.score_sum  } } }
	// 			  , 
	// 			  { $group: { _id: { school_code:  "$school_code" , faculty_code:  "$faculty_code" } , total: { $sum: 1}}}
	// 			  , { $project: { _id: 1, total: 1 , school_faculty: { $concat: [ "$_id.school_code", "-", "$_id.faculty_code" ] }}}
	// 			  //, { $project: { itemDescription: { $concat: [ "$item", " - ", "$description" ] } } }
	// 			  , function (err, logs) {
	// 			  	if (err) {
	// 				  	console.log(err);
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
	// 							console.log(logs[i]);
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
	//     // console.log(res); // [ { maxBalance: 98 } ]
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
var matriculate_list = [];

exports.matriculate = function(req, res) {
	var school_code = 'QSC';//req.body.code;
	var faculty_choice = [];
	var total_quota = 0;
	console.log('==========>Init Matriculate For '+school_code+'<===========');
	for(var x in facultyFull){
		if(facultyFull[x].school_code === school_code){
			console.log('==========>Add Faculty ['+x +']'+facultyFull[x].code+'<===========');
			facultyFull[x].matriculated = false;
			faculty_choice.push(facultyFull[x]);
			total_quota += facultyFull[x].quota;
		}
	}
	matriculate_list.push({
		school: school_code,
		faculty_choice: faculty_choice,
		total_quota : total_quota,
		matriculated_list : [],
		faculty_matriculated : [],
		faculty_filter : []
	});
	for(var x in faculty_choice){
		console.log('==========>Query Faculty ['+x +']'+faculty_choice[x].code+'<===========');
		Candidate.find({
			school_code: faculty_choice[x].school_code,
			faculty_code: faculty_choice[x].code,
		})
		.sort('-score_total')
//		.populate('user', 'displayName')
		.limit(faculty_choice[x].quota)
		.exec(function(err, candidates) {
			if (err) {
				console.log(err);
				// return res.status(400).send({
				// 	message: errorHandler.getErrorMessage(err)
				// });
			} else {
				
				
				if(candidates.length > 0){
					var candidate = candidates[0];
					console.log('==========>Init Faculty '+candidate.faculty_code+'<===========');
					console.log('-candidates : ',candidates.length);					
					console.log('--candidate first : ',candidate.school_code, candidate.faculty_code);
					for(var x_index in matriculate_list){
						console.log('---Find school for : ',candidate.school_code,candidate.faculty_code);
						console.log('---For school for : ',candidate.school_code,candidate.faculty_code, matriculate_list[x_index].school);
						if(matriculate_list[x_index].school 
						=== candidate.school_code){
							console.log('--- See school for : ',candidate.faculty_code);
							for(var y_index in matriculate_list[x_index].faculty_choice){

								console.log('----Find faculty for : ',candidate.faculty_code);
								if(matriculate_list[x_index].faculty_choice[y_index].code
								=== candidate.faculty_code){

									console.log('-----Working faculty - ',candidate.faculty_code);
									// matriculate_list[x_index].faculty_choice[y_index].matriculated = true;
									matriculate_list[x_index].faculty_choice[y_index].current = candidates.length;
									matriculate_list[x_index].faculty_choice[y_index].benchmark = candidates[candidates.length -1].score_sum
									matriculate_list[x_index].faculty_choice[y_index].matriculate_list = candidates;
									matriculate_list[x_index].matriculated_list = matriculate_list[x_index].matriculated_list.concat(candidates);
									matriculate_list[x_index].faculty_matriculated.push(candidate.faculty_code);
									var check = check_school_checked(x_index);
									console.log('------check_school_checked : ',check);
									if(check){
										console.log('==========>Final Matriculate For '+school_code+'<===========');
										remove_candidates_same(x_index);
										
										res.jsonp(matriculate_list[x_index]);
									}
									break;
								}
							}
						}
					}
				}				
				//res.jsonp(candidates);
			}
		});
	}
	
};
function check_school_checked (x_index) {
	if(matriculate_list[x_index].faculty_matriculated.length 
	=== matriculate_list[x_index].faculty_choice.length){
		return true;
	}else{
		return false;
	}
	// return true;
}
function remove_candidates_same (index) {
	var candidates = matriculate_list[index].matriculated_list;
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
	matriculate_list[index].faculty_filter = candidates;
}
function get_candidates_same (list, value) {
	var result  = list.filter(function(o){return o.b == value;} );
	console.log('get_candidates_same', value, result);
	return result ? result : []; // or undefined
}
function compare_candidate_priority(candidate_a,candidate_b) {
	if (candidate_a.priority < candidate_b.priority)
    	return -1;
	if (candidate_a.priority > candidate_b.priority)
    	return 1;
	return 0;
}
function create_matriculate (score) {
	for (var i in facultyFull) {
		Candidate.aggregate(
			
		    // { $group: { _id: { school_code:  "$school_code" , faculty_code:  "$faculty_code" } , total: { $sum: 1}}},
			{ $project: { score_total: { $sum: { $multiply: [ "$score_sum", "$score_priority" ] } },}},//	
			{ $match : {score_total: { $gte: req.body.score.score_sum  } } },   
				  //, { $project: { itemDescription: { $concat: [ "$item", " - ", "$description" ] } } }
			function (err, logs) {
				  	if (err) {
					  	console.log(err);
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {

						res.jsonp(logs);
					}
				});
	};

}
function create_faculty_list () {
	for (var i in schoolAll) {
		School.findById(schoolAll[i]._id).exec(function(err, school) {
		Faculty.find({school_code : school.code}).exec(function(err, faculty) {
			var faculty_list = [];
				for (var x in faculty) {
					faculty_list.push(faculty[x]._id);
				}
			school.faculty_list = faculty_list;
			school.save(function(err) {
			});
		});
	});
	};
}
