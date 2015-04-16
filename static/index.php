<html>
<head>
<title>Dallas - Coworking Around the Globe</title>
<link href="css/styles.css" rel="stylesheet" type="text/css">
<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
<script src="//use.typekit.net/uam2aqu.js"></script>
<script>try{Typekit.load();}catch(e){}</script>



<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
<script src="js/main.js" type="text/javascript"></script>
<script type="text/javascript"
      src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBCpWY1y7do3eG1RacDVOkJ91n8SURNN7c"></script>
</head>
<body>

<aside>
	<div class="top-side">
		<div class="side-padding">
			<div class="logo">
				<img src="img/logo.png">
			</div>
			<div class="back">
				<a href="#"><i class="fa fa-arrow-left"></i>Go Back</a>
			</div>
			<div class="city">
				<h1>Dallas</h1>
			</div>
			<div class="search">
				<input type="text" name="spot" class="search-box" onkeyup="filter(this)">
				<div class="search-icon">
					<i class="fa fa-search"></i>
				</div>
			</div>
		</div>
		<!-- <hr> -->
	</div>
	<div class="city-side">
		<div class="side-padding">
			<ul class="cities">
				<li>
					<img src="img/marker-white.svg">
					<a href="#">Fort Work</a>
					<span>211 N Ervay Street 9th Floor, Dallas, TX 75201</span>
				</li>
				<li>
					<a href="#">Regus Dallas</a>
					<img src="img/marker-white.svg"><span>4514 Cole Avenue #600, Dallas, TX 75205</span>
				</li>
				<li>
					<a href="#">Comminshare</a>
					<img src="img/marker-white.svg"><span>2919 Commerce St Dallas, TX 75226</span>
				</li>
				<li>
					<a href="#">Fort Work</a>
					<img src="img/marker-white.svg"><span>211 N Ervay Street 9th Floor, Dallas, TX 75201</span>
				</li>
				<li>
					<a href="#">Regus Dallas</a>
					<img src="img/marker-white.svg"><span>4514 Cole Avenue #600, Dallas, TX 75205</span>
				</li>
				<li>
					<a href="#">Comminshare</a>
					<img src="img/marker-white.svg"><span>2919 Commerce St Dallas, TX 75226</span>
				</li>
				<li>
					<a href="#">Fort Work</a>
					<img src="img/marker-white.svg"><span>211 N Ervay Street 9th Floor, Dallas, TX 75201</span>
				</li>
				<li>
					<a href="#">Regus Dallas</a>
					<img src="img/marker-white.svg"><span>4514 Cole Avenue #600, Dallas, TX 75205</span>
				</li>
				<li>
					<a href="#">Comminshare</a>
					<img src="img/marker-white.svg"><span>2919 Commerce St Dallas, TX 75226</span>
				</li>
			</ul>
		</div>
	</div>
</aside>


<!-- Map Section! -->
<section id="main">
	<section id="cd-google-map">
	<!-- #google-container will contain the map  -->
	<div id="google-container"></div>
	<!-- #cd-zoom-in and #zoom-out will be used to create our custom buttons for zooming-in/out -->
	<div id="cd-zoom-in"><i class="fa fa-plus"></i></div>
	<div id="cd-zoom-out"><i class="fa fa-minus"></i></div>
	<div id="coordinator">
		<div class="left">
			<div class="border-wrapper"><img src="http://placehold.it/100x100"></div>
			<div class="listed">
				<a href="#">Get My Space Listed</a>
			</div>
		</div>
		<div class="right">
			<h4>City Coordinator</h4>
			<a href="#" class="box-link">Oren Salomon<br>@iOren</a>
		</div>
	</div>
</section>
</section>

<script language="javascript" type="text/javascript">
    function filter(element) {
        var value = $(element).val();
        
        $(".cities > li").each(function() {
            if ($(this).text().search(value) > -1) {
            	console.log($(this).text());
                $(this).show();
            }
            else {
                $(this).hide();
            }
        });

        $("#content h4").each(function() {
        	if ($(this).text().search(value) > -1) {
            	console.log($(this).text());
                $(this).show();
            }
            else {
                $(this).hide();
            }
        });
    }
</script>
</body>
</html>