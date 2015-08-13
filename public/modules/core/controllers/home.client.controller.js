'use strict';

angular.module('core').controller('HomeController', ['$scope', '$stateParams',
	'$location', '$http', 'Authentication', 'Subjectgroups', 'Subjects', 'Schools',
	'Sectoritems', 'Sectors',
	function($scope, $stateParams, $location, $http, Authentication, Subjectgroups, 
		Subjects, Schools, Sectoritems, Sectors) {

		$scope.score = {
			score_1 : Math.floor(Math.random()*(7-5+1)+5),
			score_2 : Math.floor(Math.random()*(7-5+1)+5), 
			score_3 : Math.floor(Math.random()*(7-5+1)+5), 
			score_priority : Math.floor(Math.random()*(3-0+1)+0),
		};

		$scope.authentication = Authentication;
		$scope.subjectgroups = Subjectgroups.query(function (data) {
			$scope.subject_group = data[0];
			$scope.opportunity();
		});
		$scope.subjects = Subjects.query();
		$scope.schools = Schools.query();

		$scope.sectoritems = Sectoritems.query();
		$scope.sectoritem = {};
		$scope.sectors = Sectors.query();
		$scope.sector = {};

		$scope.opportunity_string_array = [
			'Tương lai có rất nhiều tên: Với kẻ yếu, nó là Điều không thể đạt được. Đối với người hay sợ hãi, nó là Điều chưa biết. Với ai dũng cảm, nó là Cơ hội. Victor Hugo',
			'Cho dù có lúc ước mơ bị che mờ, bị vùi dập trong những thử thách của cuộc sống khiến bạn không còn muốn nghĩ về nó nữa. Nhưng bạn đừng bao giờ từ bỏ nó, vì đó chính là ý nghĩa thực sự của cuộc sống, là điều cần thiết tạo nên sức mạnh cho bạn.',
			"Mọi thứ tiêu cực - áp lực, thử thách - đều là cơ hội để tôi vươn lên. Kobe Bryant",
			"Hãy nắm lấy cơ hội! Tất cả cuộc đời là cơ hội. Người tiến xa nhất thường là người sẵn sàng hành động và chấp nhận thách thức. Dale Carnegie",
			"Bạn càng tìm kiếm sự bảo đảm, bạn càng ít có nó. Nhưng bạn càng tìm kiếm cơ hội, bạn càng có thể đạt được sự bảo đảm mà mình muốn. Brian Tracy",
			"Thời gian vội vã lao đi; Cơ hội nảy sinh rồi tan biến... Vậy mà bạn vẫn chờ đợi và không dám thử - Con chim có đôi cánh mà không dám bay lên. A. A. Milne",
			"Tôi hiếm khi nhận ra được cơ hội cho tới khi mà nó không còn là cơ hội. Mark Twain",
			"Để thành công, hãy chớp lấy cơ hội cũng nhanh như khi vội vã kết luận. Benjamin Franklin",
			"Anh muốn bỏ phần còn lại của cuộc đời mình đi bán nước đường hay anh muốn có cơ hội thay đổi thế giới? - Câu hỏi nổi tiếng của Steve Jobs dành cho John Sculley, giám đốc trước của Apple. Steve Jobs",
			"Trên trái đất này không có sự bảo đảm; chỉ có cơ hội. Douglas MacArthur",
			"Thử thách càng lớn, cơ hội càng lớn. Khuyết danh",
			"Hãy học cách lắng nghe. Cơ hội có thể gõ cửa rất khẽ khàng. Frank Tyger",
			"Cơ hội đến với tất cả mọi người, nhưng ít người có thể nắm bắt được cơ hội. Edward Bulwer Lytton",
			"Thà lấy thứ không thuộc về mình còn hơn là để nó nằm quanh bị bỏ mặc. Mark Twain",
			"Hãy tập trung nỗ lực cao nhất vào những cơ hội tốt nhất chứ không phải những rắc rối tồi tệ nhất. Khuyết danh",
			"Thường trong khi dừng lại để nghĩ, chúng ta để lỡ cơ hội. Publilius Syrus",
			"Cơ hội giống như bình minh. Nếu bạn chờ quá lâu, bạn sẽ bỏ lỡ nó. William Arthur Ward",
			"Cơ hội, đó là vị thần tối cao đang sinh nở. Balzac",
			"Vỏ bọc cải trang mà cơ hội yêu thích nhất là rắc rối. Frank Tyger",
			"Người khôn biết biến cơ hội thành của cải. Thomas Fuller",
			"Cơ hội thường khó để nhận ra; thế mà chúng ta lại thường chờ mong nó mời gọi ta với tiếng còi và bảng hiệu. William Arthur Ward",
			"Sự vượt trội không bao giờ chỉ là vô tình; đó là kết quả của sự chú tâm cao độ, nỗ lực tận tâm, định hướng thông minh, thực hành khéo léo, và tầm nhìn để thấy được cơ hội trong trở ngại. Khuyết danh",
			"Anh ta chưa bao giờ thành công lắm. Khi cơ hội gõ cửa, anh ta phàn nàn về tiếng ồn. Khuyết danh",
			"Người lạc quan luôn nhìn thấy cơ hội trong mọi hiểm nguy, còn kẻ bi quan luôn nhìn thấy hiểm nguy trong mọi cơ hội. Winston Churchill",
			"Cơ hội thành công của bạn trong mọi chuyện luôn có thể được đo bằng niềm tin của bạn vào chính bản thân mình. Robert Collier",
			"Người bi quan luôn tìm thấy khó khăn trong mọi cơ hội. Người lạc quan luôn nhìn được cơ hội trong từng khó khăn. Khuyết danh",
			"Mỗi ngày đều là một cơ hội mới. Ngày hôm qua đã kết thúc. Hôm nay là ngày đầu tiên của tương lai. Louise Hay",
			"Những cơ hội nhỏ thường mở đầu cho những sự nghiệp lớn. Demosthenes",
			"Thận trọng là rất tốt, nhưng nếu thận trọng quá chúng ta sẽ bỏ lỡ mất cơ hội. Yoshijir Umezu"
		];
		
		$scope.view_table = null;
		$scope.view_table_faculty = function (faculty) {
			if($scope.view_table == faculty){
				$scope.view_table = null;
			}else{
				$scope.view_table = faculty;
			}
			
		}
		$scope.view_school = function (school) {
			school.faculty = 'load';
			var data = {school: school.code}
			$http({method: 'POST', url: 'apis/viewschool', async:false,data:data})
			.success(function(data, status, headers, config) {		
				//console.log(data);
				if(data.result){
					school.faculty = data.record;
				}else{
					window.alert(data.message);
				}
			}).error(function(data, status, headers, config) {
				window.alert("Server has experienced a problem. please try again after some time!");
				// console.log(data);
			});
		}
		$scope.message = '';
		$scope.opportunity = function (school) {			
			function opportunity_api (subject_group,score, first) {
				// var sector = '';
				// if($scope.sector){
				// 	sector = $scope.sector.code;
				// }
				var sectoritem = [];
				if($scope.sectoritem && Object.keys($scope.sectoritem).length > 0){
					//console.log('$scope.sectoritem',$scope.sectoritem);
					sectoritem.push($scope.sectoritem.code);// = [req.body.sector.code;
				}
				console.log('$scope.sectoritem',$scope.sectoritem,$scope.sector != null);
				if($scope.sector != null){
					if(sectoritem.length <= 0 && Object.keys($scope.sector).length > 0){
						console.log('sector items length');
						for(var x in $scope.sectoritems){
							if( $scope.sectoritems[x].sector_code === $scope.sector.code){
								sectoritem.push($scope.sectoritems[x].code);
							}
							
						}
					}
				}

				
				var data = {
					subject_group:subject_group ,
					sectoritem:sectoritem ,
					// sector:sector ,
					score: score,
				}
				loading_page.loading();
				$scope.facultys = [];
				$scope.schools = [];
				$scope.opportunity_string = $scope.opportunity_string_array[Math.floor(Math.random()*($scope.opportunity_string_array.length - 1-0+1)+0)];
				$http({method: 'POST', url: 'apis/opportunity', async:false,data:data})
				.success(function(data, status, headers, config) {
					if(data.result){
						if(first){
							$scope.facultys = data.record;
						}else{
							$scope.facultys = $scope.facultys.concat(data.record);
						}						//children = hege.concat(stale);
						
					}else{
						if(first){
							window.alert(data.message);		
						}				
					}
					console.log(data);
					loading_page.hide();
				}).error(function(data, status, headers, config) {
					if(first){
						window.alert("Server has experienced a problem. please try again after some time!");
					}		
					loading_page.hide();
				});
			}
			$scope.message = '';
			if($scope.score.score_1 + $scope.score.score_2 + $scope.score.score_3 + $scope.score.score_priority < 15 ){
				$scope.message = 'Hệ thống tạm thời chỉ xử lý dữ liệu xét tuyển Đại Học. Bạn vui lòng nhập điểm với tổng chưa nhân hệ số từ 15đ trở lên!';
			}else{
				opportunity_api (
					$scope.subject_group,
					$scope.score, true);

				//X2 subject1
				opportunity_api (				
					{
						subject1 : $scope.subject_group.subject1+'X2',
						subject2 : $scope.subject_group.subject2,
						subject3 : $scope.subject_group.subject3,
					}, {
						score_1 : $scope.score.score_1*2,
						score_2 : $scope.score.score_2,
						score_3 : $scope.score.score_3,
						score_priority : $scope.score.score_priority,
					},
					false
				);
				
				//X2 subject2
				opportunity_api (					
					{
						subject1 : $scope.subject_group.subject1,
						subject2 : $scope.subject_group.subject2+'X2',
						subject3 : $scope.subject_group.subject3,
					}, {
						score_1 : $scope.score.score_1,
						score_2 : $scope.score.score_2*2,
						score_3 : $scope.score.score_3,
						score_priority : $scope.score.score_priority,
					},
					false
				);

				//X2 subject3
				opportunity_api (					
					{
						subject1 : $scope.subject_group.subject1,
						subject2 : $scope.subject_group.subject2,
						subject3 : $scope.subject_group.subject3+'X2',
					}, {
						score_1 : $scope.score.score_1,
						score_2 : $scope.score.score_2,
						score_3 : $scope.score.score_3*2,
						score_priority : $scope.score.score_priority,
					},
					false
				);

				//X2 subject1 subject2
				opportunity_api (					
					{
						subject1 : $scope.subject_group.subject1+'X2',
						subject2 : $scope.subject_group.subject2+'X2',
						subject3 : $scope.subject_group.subject3,
					}, {
						score_1 : $scope.score.score_1*2,
						score_2 : $scope.score.score_2*2,
						score_3 : $scope.score.score_3,
						score_priority : $scope.score.score_priority,
					},
					false
				);

				//X2 subject1 subject3
				opportunity_api (					
					{
						subject1 : $scope.subject_group.subject1+'X2',
						subject2 : $scope.subject_group.subject2,
						subject3 : $scope.subject_group.subject3+'X2',
					}, {
						score_1 : $scope.score.score_1*2,
						score_2 : $scope.score.score_2,
						score_3 : $scope.score.score_3*2,
						score_priority : $scope.score.score_priority,
					},
					false
				);

				//X2 subject2 subject3
				opportunity_api (					
					{
						subject1 : $scope.subject_group.subject1,
						subject2 : $scope.subject_group.subject2+'X2',
						subject3 : $scope.subject_group.subject3+'X2',
					}, {
						score_1 : $scope.score.score_1,
						score_2 : $scope.score.score_2*2,
						score_3 : $scope.score.score_3*2,
						score_priority : $scope.score.score_priority,
					},
					false
				);

				//X2 subject1 subject2 subject3
				opportunity_api (					
					{
						subject1 : $scope.subject_group.subject1+'X2',
						subject2 : $scope.subject_group.subject2+'X2',
						subject3 : $scope.subject_group.subject3+'X2',
					}, {
						score_1 : $scope.score.score_1*2,
						score_2 : $scope.score.score_2*2,
						score_3 : $scope.score.score_3*2,
						score_priority : $scope.score.score_priority,
					},
					false
				);

			}
		}
		
	}
]);

