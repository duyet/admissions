'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Statistic = mongoose.model('Statistic'),
	Candidate = mongoose.model('Candidate'),
	School = mongoose.model('School'),
	Faculty = mongoose.model('Faculty'),
	_ = require('lodash');


/**
 * Api middleware
 */
exports.apiByID = function(req, res, next, id) { 
		req.api.id = id ;
		next();
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
exports.opportunity = function(req, res) { 
	if(_.has(req.body, 'subject_group') && _.has(req.body, 'score')){

		var subject1 = req.body.subject_group.subject1;
		var subject2 = req.body.subject_group.subject2;
		var subject3 = req.body.subject_group.subject3;

		var shuffle = shuffle_func(subject1, subject2, subject3);
		

		var score_priority = req.body.score.score_priority;
		var score_1 = req.body.score.score_1;
		var score_2 = req.body.score.score_2;
		var score_3 = req.body.score.score_3;

		var condition_score = score_priority + score_1 + score_2 + score_3;

		var sectoritem = [];
		if(_.has(req.body, 'sectoritem')){
			for(var s_index in req.body.sectoritem){
				var item = RegExp(req.body.sectoritem[s_index], 'i');
				sectoritem.push(item);
			}
		}
		var match = { $match : {
					subject_group : {$in : shuffle},
					quota :{ $gt: 0  },
					code : {$in : sectoritem}
				}
			};
		if(sectoritem.length === 0){
			match = { $match : {
					subject_group : {$in : shuffle},
					quota :{ $gt: 0  },
				}
			};
		}
		Faculty.aggregate(
			{ $project: { 
				name: 1,
				code: 1,
				school_name: 1,
				school_code: 1,
				subject_group: 1,
				quota: 1,
				current: 1,
				benchmark: 1, 
				matriculate : 1, 
				candidate_apply : 1, 
				school_faculty: { $concat: [ "$school_code", "-", "$code" ] }}
			},
			match, 
			function (err, facultys) {
		
			  	if (err) {
				  	//console.log('Faculty.aggregate',err);
				  	res.jsonp({
						result:false, 
						message: err.toString()
					});
				} else {
					var condition_faculty = _.pluck(facultys, 'school_faculty');
					Candidate.aggregate(
						{ $match : {
							score_final: { $gte: condition_score  } } 
						}, 
						{ $group: { _id: { school_code:  "$school_code" , faculty_code:  "$faculty_code" } 
							, total: { $sum: 1}}
						}, 
						{ $project: { 
							_id: 1, 
							total: 1 ,  
							school_faculty: { $concat: [ "$_id.school_code", "-", "$_id.faculty_code" ] }}
						},			
						{ $match : {school_faculty : {$in : condition_faculty}, } }, 						
						function (err, candidates) {
					
						  	if (err) {
						  		console.log('Faculty.aggregate',err);
						  		res.jsonp({
									result:false, 
									message: err.toString()
								});
						  	}else{
						  		var record = []
						  		for(var f_index in facultys){
						  			var candidate =  _.filter(candidates, function(object) {
									  return object.school_faculty == facultys[f_index].school_faculty;
									});
									var total = 1;
									if(candidate.length > 0){
										total = candidate[0].total;
									}else{

									}
						  			record.push(
						  				_.merge({
						  					index : total, 
						  					remain : facultys[f_index].quota -  total,
						  					opportunity : ((facultys[f_index].quota -  total)/facultys[f_index].quota)*100
						  				}, facultys[f_index])
						  			)
						  		}
						  		res.jsonp({
									result:true, 
									record: _.sortByOrder(record, ['opportunity'],['desc']),
									message: ''
								});
						  	}
						}
					);
				}
			}
		);

	}		
	
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

exports.domatriculate = function(req, res) {
	if(_.has(req.body, 'school')){
		// initialization.run_matriculate(req.body.school, res);
		var matriculate = require('../../app/controllers/api/matriculate');
		matriculate.init(req.body.school, res, facultyFull);
	}else{
		res.jsonp({
			result:false, 
			message:'Quá trình xử lý có một vấn đề. Vui lòng thử lại sau!'
		});
	}
	//school
}
/**
 * matriculate a Api
 */

exports.initialization = function(req, res) {
	if(_.has(req.body, 'school')){
		// initialization.run_matriculate(req.body.school, res);
		var initialization = require('../../app/controllers/api/initialization');
		initialization.init(req.body.school, res, facultyFull);
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
	var conditions = {'$and' : [{faculty_code:{'$ne' : null}},{faculty_code:{'$ne' : ""}}]};
	if(_.has(req.body, 'conditions')){
		console.log(req.body.conditions)
		conditions = {};
		for(var c_index in req.body.conditions){
			if(req.body.conditions[c_index].type === 'school'){
				conditions = _.extend(conditions,{school_code : req.body.conditions[c_index].value});
			}
			if(req.body.conditions[c_index].type === 'faculty'){
				conditions = _.extend(conditions,{faculty : req.body.conditions[c_index].value});
			}
			if(req.body.conditions[c_index].type === 'priority'){
				conditions = _.extend(conditions,{priority : req.body.conditions[c_index].value});
			}
			if(req.body.conditions[c_index].type === 'subjectgroup'){
				var arr = req.body.conditions[c_index].value.split("-");
				var group = shuffle_func(arr[0],arr[1],arr[2]);
				conditions = _.extend(conditions,{subject_group : {'$in':group}});
			}
		}
	}
	if(_.has(req.body, 'query')){
		console.log(req.body.query)
		 var regex = new RegExp(req.body.query, "i");
		conditions = _.extend(conditions,{'$or':[{student_id : regex},{student_name : regex}]});
	}
	console.log(conditions);
	var nPerPage = 50;
	var pageNumber = 0;
	if(_.has(req.body, 'pagination_active')){
		pageNumber = req.body.pagination_active;
	}
	Candidate
		.count(conditions)
		.exec(function(err, count_faculties) {
			if (err) {
				res.jsonp({
					result:false, 
					message:err.toString()
				});
			} else {
	//.count
		Candidate
		.find(conditions,{score_1:0, score_2: 0, score_3 : 0})
		.skip(pageNumber > 1 ? ((pageNumber-1)*nPerPage) : 0).limit(nPerPage)
		.limit(nPerPage)
		.sort('-score_final')
		.exec(function(err, faculties) {
			if (err) {
				res.jsonp({
					result:false, 
					message:err.toString()
				});
			} else {
				var record = [];
				for (var x_index = 0; x_index < faculties.length; x_index++) {
				// 	Things[i]
				// };
				// for(var x_index = 0 ; in faculties){
					var faculty_choice =  _.uniq(_.filter(facultyFull, function(object) {
					  return object.code === faculties[x_index].faculty;
					}));
					var school_choice =  _.uniq(_.filter(schoolAll, function(object) {
					  return object.code === faculties[x_index].school_code;
					}));
					var faculty = faculties[x_index].faculty
					var school_code = faculties[x_index].school_code
					if(faculty_choice.length > 0){
						faculty = faculty_choice[0].name;
					}
					if(school_choice.length > 0){
						school_code = school_choice[0].name;
					}
					record.push({
						faculty : faculty,
						school_code: school_code,
						subject_group: faculties[x_index].subject_group,
						student_name: faculties[x_index].student_name,
						student_id: faculties[x_index].student_id,
						faculty_code: faculties[x_index].faculty_code,
						score_final: faculties[x_index].score_final,
						score_priority: faculties[x_index].score_priority,
						priority: faculties[x_index].priority
					});
				}
				res.jsonp({
					result:true, 
					record: record,
					length: _.ceil(count_faculties/50),
					pagination_active: pageNumber,
					message:''
				});
			}
		});
			}
		});
}
exports.matriculate = function(req, res) {
	var school_code = 'QSC';
	Candidate.aggregate( [ 
		{ $match : {school_code : 'DDK'}},
		{ $group : { _id : {faculty_code:  "$faculty_code", } } } ,
		{ $project: { _id: 1, school_code:1, faculty_code: "$_id.faculty_code"}},
		], 
		function (err, logs) {  
	  	if (err) {
		  	console.log(err);
		} else {
			console.log(_.pluck(logs, 'faculty_code'));
			
		}
	}
	);
	
};

/**
 * initschoolsfortest
 */
exports.initschoolsfortest = function(req, res) {
	console.log('initschools');
	console.log(new Date(new Date().setDate(new Date().getDate()-1)));
	console.log(new Date());
	School.update( 
		{status : 1}, 
		{ modified : new Date(new Date().setDate(new Date().getDate()-2))}, 
		{ multi: true }, 
		function (err, numberAffected, raw) {
			console.log('initschools');
			if(err){
				res.jsonp({
					result:false, 
					message: err.toString()
				});
			}else{
				res.jsonp({
					result:true, 
					message: ''
				});
			}
	})
};

/**
 * initschools
 */
exports.initschools = function(req, res) {
	function set_school_no_active (callback) {
		School.update(
			{},
			{ status : 0,},
			{ multi: true }, 
			function (err, numberAffected, raw) {
				callback();
		});
	}
	function set_school_active (school_code,callback) {
		School.update( 
			{code :{$in : school_code}}, 
			{ status : 1, modified : new Date(new Date().setDate(new Date().getDate()-2))}, 
			{ multi: true }, 
			function (err, numberAffected, raw) {
				callback();
		});
	}
	function set_faculty_statistic () {
		Candidate.aggregate( 
			{ $group: { _id: { school_code:  "$school_code" , faculty_code:  "$faculty_code" } }}, 
			{ $project: { 
				_id: 1, 
				school_faculty: { $concat: [ "$_id.school_code", "-", "$_id.faculty_code" ] }}
			},		
			function (err, candidates) {
		
			  	if (err) {
					// return res.status(400).send({
					// 	message: errorHandler.getErrorMessage(err)
					// });
			  	}else{
			  		Statistic.findOne({key : 'faculty'})
			  		.exec(function(err, statistic) {
						if (err) {
							// return res.status(400).send({
							// 	message: errorHandler.getErrorMessage(err)
							// });
						} else {
							//console.log('statistic' , statistic, _.isEmpty(statistic));
							if(_.isEmpty(statistic) === false){
								statistic.value = candidates.length;
								statistic.modified = new Date();
								statistic.save();
							}else{
								var statistic = new Statistic({
									key : 'faculty',
									value : candidates.length,
									name : 'Ngành', 
									view : 1,
									modified : new Date(),
								});
								statistic.save();

							}
						}
					});

			  	}
			}
		);
	}
	function set_school_statistic () {
		Candidate.aggregate( 
			{$match : {school_code: {$ne: null}}},
			{ $group: { _id: { school_code:  "$school_code"  } }}, 
			{$project: {school_code: '$_id.school_code'}},		
			function (err, candidates) {
			  	if (err) {
			  	}else{
			  		Statistic.findOne({key : 'school'})
			  		.exec(function(err, statistic) {
						if (err) {
							// return res.status(400).send({
							// 	message: errorHandler.getErrorMessage(err)
							// });
						} else {
							//console.log('school' , candidates);
							if(_.isEmpty(statistic)  === false ){
								statistic.value = candidates.length;
								statistic.modified = new Date();
								statistic.save();
							}else{
								var statistic = new Statistic({
									key : 'school',
									name: 'Trường',
									view : 0,
									value : candidates.length,
									modified : new Date(),
								});
								statistic.save();
							}
						}
					});
					console.log('school' , candidates);
			  		var school_code = _.pluck(candidates,'school_code');
			  		console.log('school' , school_code);
			  		set_school_no_active(function() {
			  			set_school_active(school_code, function () {
				  			var initialization = require('../../app/controllers/api/initialization');
				  			initialization.init(res);
				  		})	
			  		});	
			  	}
			}
		);
	}
	function set_candidate_statistic () {
		Candidate.count()
		.exec(function(err, candidates) {
			if (err) {
			}else{
				Statistic.findOne({key : 'student'})
		  		.exec(function(err, statistic) {
					if (err) {
						// return res.status(400).send({
						// 	message: errorHandler.getErrorMessage(err)
						// });
					} else {
						//console.log('candidate' , statistic, _.isEmpty(statistic));
						if(_.isEmpty(statistic)  === false ){
							statistic.value = candidates;
							statistic.modified = new Date();
							statistic.save();
						}else{
							var statistic = new Statistic({
								key : 'candidate',
								name : 'Hồ sơ',
								view : 4,
								value : candidates,
								modified : new Date(),
							});
							statistic.save();
						}
					}
				});

											
			}
		});
	}
	function set_student_statistic () {
		Candidate.find({},{student_id: 1})
		.exec(function(err, candidates) {
			if (err) {
			}else{
				var candidate_all = _.uniq(candidates, 'student_id');
				Statistic.findOne({key : 'student'})
		  		.exec(function(err, statistic) {
					if (err) {
						// return res.status(400).send({
						// 	message: errorHandler.getErrorMessage(err)
						// });
					} else {
						//console.log('student' , statistic, _.isEmpty(statistic));
						if(_.isEmpty(statistic)  === false ){
							statistic.value = candidate_all.length;
							statistic.modified = new Date();
							statistic.save();
						}else{
							var statistic = new Statistic({
								key : 'student',
								name : 'Thí sinh',
								view : 3,
								value : candidate_all.length,
								modified : new Date(),
							});
							statistic.save();
						}
					}
				});
											
			}
		});
	}
	set_faculty_statistic();
	set_school_statistic();
	set_candidate_statistic();
	set_student_statistic();
	Faculty.aggregate(
		{ $group: { _id: { school_code:  "$school_code" }
						, total: { $sum: '$quota'}}
					},  
		{ $project: { 
			school_code: "$_id.school_code",
			total : 1
		}
		},
		function (err, facultys) {
			//console.log(facultys)
		  	if (err) {
		  		console.log(err)
		  	}else{
		  		var quota = _.sum(facultys, function(object) {
				  return object.total;
				});
				Statistic.findOne({key : 'quota'})
		  		.exec(function(err, statistic) {
					if (err) {
						// return res.status(400).send({
						// 	message: errorHandler.getErrorMessage(err)
						// });
					} else {
						//console.log('student' , statistic, _.isEmpty(statistic));
						if(_.isEmpty(statistic)  === false ){
							statistic.value = quota;
							statistic.modified = new Date();
							statistic.save();
						}else{
							var statistic = new Statistic({
								key : 'quota',
								name : 'Chỉ tiêu',
								view : 2,
								value : quota,
								modified : new Date(),
							});
							statistic.save();
						}
					}
				});
		  		// var school_code = _.pluck(facultys,'school_code');
		  		// set_school_no_active(function() {
		  		// 	set_school_active(school_code, function () {
			  	// 		var initialization = require('../../app/controllers/api/initialization');
			  	// 		initialization.init(res);
			  	// 	})	
		  		// });		  		
		  	}
		}
	);
	
};




