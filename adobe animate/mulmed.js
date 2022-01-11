(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"mulmed_atlas_1", frames: [[0,875,1087,123],[1282,819,325,417],[1760,510,254,408],[0,1500,445,285],[1282,510,476,307],[0,1787,755,122],[757,1926,749,120],[0,1911,755,122],[447,1500,755,122],[1534,0,314,508],[1361,1540,594,125],[1361,1667,594,125],[1361,1794,594,125],[1506,1238,455,110],[1506,1350,455,110],[0,375,1280,123],[0,500,1280,123],[0,625,1280,123],[0,750,1280,123],[0,1125,1072,123],[0,1250,1072,123],[0,1375,1072,123],[0,0,1532,123],[0,1000,1087,123],[0,125,1532,123],[1508,1921,528,123],[0,250,1532,123],[757,1624,300,300],[1059,1624,300,300],[1204,1238,300,300],[1609,920,300,300]]},
		{name:"mulmed_atlas_2", frames: [[499,1456,1532,123],[0,1456,497,497],[822,0,769,532],[499,1581,1532,123],[499,1706,1532,123],[499,1831,1532,123],[1160,534,672,371],[0,0,820,499],[0,1063,695,391],[654,534,504,495],[0,501,652,560]]},
		{name:"mulmed_atlas_3", frames: [[0,1223,1561,396],[0,0,1348,499],[870,501,800,687],[0,501,868,720]]},
		{name:"mulmed_atlas_4", frames: [[0,611,1524,531],[0,0,1450,609],[0,1144,944,811]]},
		{name:"mulmed_atlas_5", frames: [[0,1202,1641,575],[0,0,1920,1200]]},
		{name:"mulmed_atlas_6", frames: [[0,0,1920,1281]]},
		{name:"mulmed_atlas_7", frames: [[1501,0,262,136],[1765,0,262,136],[957,91,262,136],[1221,91,262,136],[457,100,259,136],[0,112,259,136],[1485,138,259,136],[1746,138,259,136],[718,229,466,70],[0,250,466,70],[1186,276,466,70],[468,301,466,70],[0,322,466,70],[936,348,466,70],[1654,276,355,79],[1404,357,355,79],[468,373,355,79],[0,394,355,79],[1761,357,246,79],[0,475,246,79],[676,501,246,79],[924,501,246,79],[1182,438,317,79],[1501,438,317,79],[357,454,317,79],[825,420,355,79],[957,0,542,89],[457,0,498,98],[0,0,455,110],[718,100,20,123]]}
];


(lib.AnMovieClip = function(){
	this.actionFrames = [];
	this.currentSoundStreamInMovieclip;
	this.soundStreamDuration = new Map();
	this.streamSoundSymbolsList = [];

	this.gotoAndPlayForStreamSoundSync = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.gotoAndPlay = function(positionOrLabel){
		this.clearAllSoundStreams();
		var pos = this.timeline.resolve(positionOrLabel);
		if (pos != null) { this.startStreamSoundsForTargetedFrame(pos); }
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.play = function(){
		this.clearAllSoundStreams();
		this.startStreamSoundsForTargetedFrame(this.currentFrame);
		cjs.MovieClip.prototype.play.call(this);
	}
	this.gotoAndStop = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndStop.call(this,positionOrLabel);
		this.clearAllSoundStreams();
	}
	this.stop = function(){
		cjs.MovieClip.prototype.stop.call(this);
		this.clearAllSoundStreams();
	}
	this.startStreamSoundsForTargetedFrame = function(targetFrame){
		for(var index=0; index<this.streamSoundSymbolsList.length; index++){
			if(index <= targetFrame && this.streamSoundSymbolsList[index] != undefined){
				for(var i=0; i<this.streamSoundSymbolsList[index].length; i++){
					var sound = this.streamSoundSymbolsList[index][i];
					if(sound.endFrame > targetFrame){
						var targetPosition = Math.abs((((targetFrame - sound.startFrame)/lib.properties.fps) * 1000));
						var instance = playSound(sound.id);
						var remainingLoop = 0;
						if(sound.offset){
							targetPosition = targetPosition + sound.offset;
						}
						else if(sound.loop > 1){
							var loop = targetPosition /instance.duration;
							remainingLoop = Math.floor(sound.loop - loop);
							if(targetPosition == 0){ remainingLoop -= 1; }
							targetPosition = targetPosition % instance.duration;
						}
						instance.loop = remainingLoop;
						instance.position = Math.round(targetPosition);
						this.InsertIntoSoundStreamData(instance, sound.startFrame, sound.endFrame, sound.loop , sound.offset);
					}
				}
			}
		}
	}
	this.InsertIntoSoundStreamData = function(soundInstance, startIndex, endIndex, loopValue, offsetValue){ 
 		this.soundStreamDuration.set({instance:soundInstance}, {start: startIndex, end:endIndex, loop:loopValue, offset:offsetValue});
	}
	this.clearAllSoundStreams = function(){
		this.soundStreamDuration.forEach(function(value,key){
			key.instance.stop();
		});
 		this.soundStreamDuration.clear();
		this.currentSoundStreamInMovieclip = undefined;
	}
	this.stopSoundStreams = function(currentFrame){
		if(this.soundStreamDuration.size > 0){
			var _this = this;
			this.soundStreamDuration.forEach(function(value,key,arr){
				if((value.end) == currentFrame){
					key.instance.stop();
					if(_this.currentSoundStreamInMovieclip == key) { _this.currentSoundStreamInMovieclip = undefined; }
					arr.delete(key);
				}
			});
		}
	}

	this.computeCurrentSoundStreamInstance = function(currentFrame){
		if(this.currentSoundStreamInMovieclip == undefined){
			var _this = this;
			if(this.soundStreamDuration.size > 0){
				var maxDuration = 0;
				this.soundStreamDuration.forEach(function(value,key){
					if(value.end > maxDuration){
						maxDuration = value.end;
						_this.currentSoundStreamInMovieclip = key;
					}
				});
			}
		}
	}
	this.getDesiredFrame = function(currentFrame, calculatedDesiredFrame){
		for(var frameIndex in this.actionFrames){
			if((frameIndex > currentFrame) && (frameIndex < calculatedDesiredFrame)){
				return frameIndex;
			}
		}
		return calculatedDesiredFrame;
	}

	this.syncStreamSounds = function(){
		this.stopSoundStreams(this.currentFrame);
		this.computeCurrentSoundStreamInstance(this.currentFrame);
		if(this.currentSoundStreamInMovieclip != undefined){
			var soundInstance = this.currentSoundStreamInMovieclip.instance;
			if(soundInstance.position != 0){
				var soundValue = this.soundStreamDuration.get(this.currentSoundStreamInMovieclip);
				var soundPosition = (soundValue.offset?(soundInstance.position - soundValue.offset): soundInstance.position);
				var calculatedDesiredFrame = (soundValue.start)+((soundPosition/1000) * lib.properties.fps);
				if(soundValue.loop > 1){
					calculatedDesiredFrame +=(((((soundValue.loop - soundInstance.loop -1)*soundInstance.duration)) / 1000) * lib.properties.fps);
				}
				calculatedDesiredFrame = Math.floor(calculatedDesiredFrame);
				var deltaFrame = calculatedDesiredFrame - this.currentFrame;
				if(deltaFrame >= 2){
					this.gotoAndPlayForStreamSoundSync(this.getDesiredFrame(this.currentFrame,calculatedDesiredFrame));
				}
			}
		}
	}
}).prototype = p = new cjs.MovieClip();
// symbols:



(lib.CachedBmp_68 = function() {
	this.initialize(ss["mulmed_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_67 = function() {
	this.initialize(ss["mulmed_atlas_2"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_66 = function() {
	this.initialize(ss["mulmed_atlas_7"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_65 = function() {
	this.initialize(ss["mulmed_atlas_1"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_64 = function() {
	this.initialize(ss["mulmed_atlas_7"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_63 = function() {
	this.initialize(ss["mulmed_atlas_7"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_62 = function() {
	this.initialize(ss["mulmed_atlas_7"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_61 = function() {
	this.initialize(ss["mulmed_atlas_7"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_60 = function() {
	this.initialize(ss["mulmed_atlas_1"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_59 = function() {
	this.initialize(ss["mulmed_atlas_7"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_58 = function() {
	this.initialize(ss["mulmed_atlas_7"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_57 = function() {
	this.initialize(ss["mulmed_atlas_7"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_56 = function() {
	this.initialize(ss["mulmed_atlas_7"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_55 = function() {
	this.initialize(ss["mulmed_atlas_1"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_54 = function() {
	this.initialize(ss["mulmed_atlas_7"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_53 = function() {
	this.initialize(ss["mulmed_atlas_7"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_52 = function() {
	this.initialize(ss["mulmed_atlas_7"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_51 = function() {
	this.initialize(ss["mulmed_atlas_1"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_50 = function() {
	this.initialize(ss["mulmed_atlas_7"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_49 = function() {
	this.initialize(ss["mulmed_atlas_7"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_48 = function() {
	this.initialize(ss["mulmed_atlas_1"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_47 = function() {
	this.initialize(ss["mulmed_atlas_1"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_46 = function() {
	this.initialize(ss["mulmed_atlas_1"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_45 = function() {
	this.initialize(ss["mulmed_atlas_1"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_44 = function() {
	this.initialize(ss["mulmed_atlas_7"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_43 = function() {
	this.initialize(ss["mulmed_atlas_1"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_42 = function() {
	this.initialize(ss["mulmed_atlas_7"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_41 = function() {
	this.initialize(ss["mulmed_atlas_7"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_40 = function() {
	this.initialize(ss["mulmed_atlas_7"]);
	this.gotoAndStop(17);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_39 = function() {
	this.initialize(ss["mulmed_atlas_7"]);
	this.gotoAndStop(18);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_38 = function() {
	this.initialize(ss["mulmed_atlas_2"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_37 = function() {
	this.initialize(ss["mulmed_atlas_7"]);
	this.gotoAndStop(19);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_36 = function() {
	this.initialize(ss["mulmed_atlas_7"]);
	this.gotoAndStop(20);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_35 = function() {
	this.initialize(ss["mulmed_atlas_7"]);
	this.gotoAndStop(21);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_34 = function() {
	this.initialize(ss["mulmed_atlas_7"]);
	this.gotoAndStop(22);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_33 = function() {
	this.initialize(ss["mulmed_atlas_2"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_32 = function() {
	this.initialize(ss["mulmed_atlas_7"]);
	this.gotoAndStop(23);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_31 = function() {
	this.initialize(ss["mulmed_atlas_7"]);
	this.gotoAndStop(24);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_30 = function() {
	this.initialize(ss["mulmed_atlas_7"]);
	this.gotoAndStop(25);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_29 = function() {
	this.initialize(ss["mulmed_atlas_1"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_28 = function() {
	this.initialize(ss["mulmed_atlas_7"]);
	this.gotoAndStop(26);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_27 = function() {
	this.initialize(ss["mulmed_atlas_1"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_26 = function() {
	this.initialize(ss["mulmed_atlas_1"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_25 = function() {
	this.initialize(ss["mulmed_atlas_1"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_24 = function() {
	this.initialize(ss["mulmed_atlas_7"]);
	this.gotoAndStop(27);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_23 = function() {
	this.initialize(ss["mulmed_atlas_1"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_22 = function() {
	this.initialize(ss["mulmed_atlas_7"]);
	this.gotoAndStop(28);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_21 = function() {
	this.initialize(ss["mulmed_atlas_1"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_20 = function() {
	this.initialize(ss["mulmed_atlas_1"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_19 = function() {
	this.initialize(ss["mulmed_atlas_1"]);
	this.gotoAndStop(17);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_18 = function() {
	this.initialize(ss["mulmed_atlas_1"]);
	this.gotoAndStop(18);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_17 = function() {
	this.initialize(ss["mulmed_atlas_2"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_16 = function() {
	this.initialize(ss["mulmed_atlas_4"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_15 = function() {
	this.initialize(ss["mulmed_atlas_3"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_14 = function() {
	this.initialize(ss["mulmed_atlas_7"]);
	this.gotoAndStop(29);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_13 = function() {
	this.initialize(ss["mulmed_atlas_1"]);
	this.gotoAndStop(19);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_12 = function() {
	this.initialize(ss["mulmed_atlas_2"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_11 = function() {
	this.initialize(ss["mulmed_atlas_1"]);
	this.gotoAndStop(20);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_10 = function() {
	this.initialize(ss["mulmed_atlas_2"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_9 = function() {
	this.initialize(ss["mulmed_atlas_4"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_8 = function() {
	this.initialize(ss["mulmed_atlas_3"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_7 = function() {
	this.initialize(ss["mulmed_atlas_1"]);
	this.gotoAndStop(21);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_6 = function() {
	this.initialize(ss["mulmed_atlas_1"]);
	this.gotoAndStop(22);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_5 = function() {
	this.initialize(ss["mulmed_atlas_1"]);
	this.gotoAndStop(23);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_4 = function() {
	this.initialize(ss["mulmed_atlas_1"]);
	this.gotoAndStop(24);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_3 = function() {
	this.initialize(ss["mulmed_atlas_5"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_2 = function() {
	this.initialize(ss["mulmed_atlas_1"]);
	this.gotoAndStop(25);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1 = function() {
	this.initialize(ss["mulmed_atlas_1"]);
	this.gotoAndStop(26);
}).prototype = p = new cjs.Sprite();



(lib._03b = function() {
	this.initialize(ss["mulmed_atlas_6"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib._26261858_playiconpnggraphiccave10newsfirstremovebgpreview1 = function() {
	this.initialize(ss["mulmed_atlas_2"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib._59DarkDesktopBackgroundonWallpaperSafari3 = function() {
	this.initialize(ss["mulmed_atlas_5"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CAPTAINPROHG11FANTECHHEADPHONE03300x300 = function() {
	this.initialize(ss["mulmed_atlas_1"]);
	this.gotoAndStop(27);
}).prototype = p = new cjs.Sprite();



(lib.ECHOMH82FANTECHHEADPHONE01300x300 = function() {
	this.initialize(ss["mulmed_atlas_1"]);
	this.gotoAndStop(28);
}).prototype = p = new cjs.Sprite();



(lib.HEXAGONHG21FANTECHHEADPHONE01300x300 = function() {
	this.initialize(ss["mulmed_atlas_1"]);
	this.gotoAndStop(29);
}).prototype = p = new cjs.Sprite();



(lib.k380multidevicebluetoothkeyboard = function() {
	this.initialize(ss["mulmed_atlas_3"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.Logoremovebg2 = function() {
	this.initialize(ss["mulmed_atlas_2"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.Logo = function() {
	this.initialize(ss["mulmed_atlas_3"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.m350feature032 = function() {
	this.initialize(ss["mulmed_atlas_2"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.mxanywhere2sgalleryflounder1 = function() {
	this.initialize(ss["mulmed_atlas_4"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.pngtreestopvectoriconpngimage_4279814removebgpreview1 = function() {
	this.initialize(ss["mulmed_atlas_2"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.wirelesstouchkeyboardk400plus1 = function() {
	this.initialize(ss["mulmed_atlas_2"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.x17w300x300 = function() {
	this.initialize(ss["mulmed_atlas_1"]);
	this.gotoAndStop(30);
}).prototype = p = new cjs.Sprite();
// helper functions:

function mc_symbol_clone() {
	var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop, this.reversed));
	clone.gotoAndStop(this.currentFrame);
	clone.paused = this.paused;
	clone.framerate = this.framerate;
	return clone;
}

function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
	var prototype = cjs.extend(symbol, cjs.MovieClip);
	prototype.clone = mc_symbol_clone;
	prototype.nominalBounds = nominalBounds;
	prototype.frameBounds = frameBounds;
	return prototype;
	}


(lib.an_Video = function(options) {
	this.initialize();
	this._element = new $.an.Video(options);
	this._el = this._element.create();
}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,400,300);

p._tick = _tick;
p._handleDrawEnd = _handleDrawEnd;
p._updateVisibility = _updateVisibility;
p.draw = _componentDraw;



(lib.Symbol19 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.pngtreestopvectoriconpngimage_4279814removebgpreview1();
	this.instance.setTransform(0,0,0.3226,0.3101);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,162.6,153.5);


(lib.Symbol18 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib._26261858_playiconpnggraphiccave10newsfirstremovebgpreview1();
	this.instance.setTransform(0,0,0.3086,0.3283);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,207.4,121.8);


(lib.Symbol17 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_62();
	this.instance.setTransform(0,0,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_63();
	this.instance_1.setTransform(0,0,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_64();
	this.instance_2.setTransform(0,0,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_66();
	this.instance_3.setTransform(0,0,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_65();
	this.instance_4.setTransform(-34.35,-135.85,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_4},{t:this.instance_3}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-34.3,-135.8,165.3,208.5);


(lib.Symbol16 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_57();
	this.instance.setTransform(0,0,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_58();
	this.instance_1.setTransform(0,0,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_59();
	this.instance_2.setTransform(0,0,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_61();
	this.instance_3.setTransform(0,0,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_60();
	this.instance_4.setTransform(-12.75,-132.8,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_4},{t:this.instance_3}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-12.7,-132.8,142.2,204);


(lib.Symbol15 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.text = new cjs.Text("Descripsi lengkap", "28px 'Times New Roman'", "#FFFFFF");
	this.text.lineHeight = 33;
	this.text.lineWidth = 122;
	this.text.parent = this;
	this.text.setTransform(2,2);

	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(1,1,1).p("AqVvnIUrAAIAAfPI0rAAg");
	this.shape.setTransform(52.35,-29.2);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#666666").s().p("AqUPoIAA/PIUqAAIAAfPg");
	this.shape_1.setTransform(52.35,-29.2);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.text,p:{color:"#FFFFFF"}}]}).to({state:[{t:this.text,p:{color:"#666666"}}]},1).to({state:[{t:this.text,p:{color:"#666666"}}]},1).to({state:[{t:this.shape_1},{t:this.shape},{t:this.text,p:{color:"#FFFFFF"}}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-14.8,-130.2,140.4,202);


(lib.Symbol14 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.text = new cjs.Text("Descripsi lengkap", "28px 'Times New Roman'", "#FFFFFF");
	this.text.lineHeight = 33;
	this.text.lineWidth = 113;
	this.text.parent = this;
	this.text.setTransform(2,2);

	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(1,1,1).p("Aq0wOIVpAAMAAAAgdI1pAAg");
	this.shape.setTransform(47.7,-30);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#666666").s().p("AqzQPMAAAggcIVnAAMAAAAgcg");
	this.shape_1.setTransform(47.7,-30);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.text,p:{color:"#FFFFFF"}}]}).to({state:[{t:this.text,p:{color:"#666666"}}]},1).to({state:[{t:this.shape_1},{t:this.shape},{t:this.text,p:{color:"#FFFFFF"}}]},2).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-22.5,-134.8,140.5,209.70000000000002);


(lib.Symbol13 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_53();
	this.instance.setTransform(0,0,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_54();
	this.instance_1.setTransform(0,0,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_56();
	this.instance_2.setTransform(0,0,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_55();
	this.instance_3.setTransform(-5.1,-111.25,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_3},{t:this.instance_2}]},2).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-5.1,-111.2,238.1,146.2);


(lib.Symbol12 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_49();
	this.instance.setTransform(0,0,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_50();
	this.instance_1.setTransform(0,0,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_52();
	this.instance_2.setTransform(0,0,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_51();
	this.instance_3.setTransform(-18.95,-112.75,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_3},{t:this.instance_2}]},2).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-18.9,-112.7,251.9,153.5);


(lib.Symbol11 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_45();
	this.instance.setTransform(0,0,0.3242,0.3242);

	this.instance_1 = new lib.CachedBmp_46();
	this.instance_1.setTransform(0,0,0.3242,0.3242);

	this.instance_2 = new lib.CachedBmp_48();
	this.instance_2.setTransform(0,0,0.3242,0.3242);

	this.instance_3 = new lib.CachedBmp_47();
	this.instance_3.setTransform(-3.5,-1.4,0.3242,0.3242);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_3},{t:this.instance_2}]},2).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.5,-1.4,248.3,41);


(lib.Symbol10 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Logoremovebg2();
	this.instance.setTransform(28,12,0.1954,0.1477);

	this.instance_1 = new lib.Logo();
	this.instance_1.setTransform(0,0,0.2579,0.2226);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Symbol10, new cjs.Rectangle(0,0,223.9,160.3), null);


(lib.Symbol9 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_40();
	this.instance.setTransform(0,0,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_41();
	this.instance_1.setTransform(0,0,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_42();
	this.instance_2.setTransform(0,0,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_44();
	this.instance_3.setTransform(0,0,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_43();
	this.instance_4.setTransform(-32.25,-216.9,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_4},{t:this.instance_3}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-32.2,-216.9,209.7,256.4);


(lib.Symbol8 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_35();
	this.instance.setTransform(0,0,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_36();
	this.instance_1.setTransform(0,0,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_37();
	this.instance_2.setTransform(0,0,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_39();
	this.instance_3.setTransform(0,0,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_38();
	this.instance_4.setTransform(-73,-209,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_4},{t:this.instance_3}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-73,-209,248.5,248.5);


(lib.Symbol7 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_30();
	this.instance.setTransform(0,0,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_31();
	this.instance_1.setTransform(0,0,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_32();
	this.instance_2.setTransform(0,0,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_34();
	this.instance_3.setTransform(0,0,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_33();
	this.instance_4.setTransform(-115.3,-216.9,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_4},{t:this.instance_3}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-115.3,-216.9,384.5,266);


(lib.Symbol5 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_26();
	this.instance.setTransform(43.05,0,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_27();
	this.instance_1.setTransform(43.05,0,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_29();
	this.instance_2.setTransform(43.05,0,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_28();
	this.instance_3.setTransform(29.25,9.25,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_3},{t:this.instance_2}]},2).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(29.3,0,310.8,62.5);


(lib.Symbol2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_22();
	this.instance.setTransform(0,0,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_23();
	this.instance_1.setTransform(0,0,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_25();
	this.instance_2.setTransform(0,0,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_24();
	this.instance_3.setTransform(-21.5,0.05,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_3},{t:this.instance_2}]},2).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-21.5,0,249,55);


(lib.Scene_1_menu = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// menu
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFCC").s().p("EhN6AHeIAAu7MCb1AAAIAAO7g");
	this.shape.setTransform(498.725,49.2);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#333333").s().p("EhN/AE7IAAp0MCb2AAAIAJAAIAAJ0g");
	this.shape_1.setTransform(499.2,128.45);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.shape_1},{t:this.shape}]},71).wait(10));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_Logo = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Logo
	this.instance = new lib.Logoremovebg2();
	this.instance.setTransform(435,303,0.1954,0.1477);

	this.instance_1 = new lib.Logo();
	this.instance_1.setTransform(396,293,0.2579,0.2226);

	this.instance_2 = new lib.CachedBmp_20();
	this.instance_2.setTransform(196.6,176.8,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_21();
	this.instance_3.setTransform(196.6,176.8,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).to({state:[{t:this.instance_3},{t:this.instance_1},{t:this.instance}]},23).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_Layer_3 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_3
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(1,1,1).p("As+oxIZ9AAIAARiI59AAg");
	this.shape.setTransform(889.225,648.45);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#999999").s().p("As+IyIAAxjIZ9AAIAARjg");
	this.shape_1.setTransform(889.225,648.45);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#000000").ss(1,1,1).p("AspmkQDqg4EhgnQFVgoFsAAQCAAAB9AFQAuDCAlDTQA2ESAAEjQjpA5khAnQlVAolsAAQiAAAh+gFQgujCgkjUQg3kSAAkjg");
	this.shape_2.setTransform(697.9,648.275);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#999999").s().p("AqgInQgujCgkjUQg3kSABkjQDpg4EhgnQFVgoFsAAQCAAAB9AFQAvDCAkDTQA2ESABEjQjqA5khAnQlVAolsAAQh/AAh/gFg");
	this.shape_3.setTransform(697.9,648.275);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f().s("#000000").ss(1,1,1).p("AsTkYQCchwEJhOQEthPFZAAQB3AABzAJQBdCNBICvQBuDrAAENQicBwkJBPQktBPlZAAQh4AAhygJQhdiOhJivQhtjsAAkMg");
	this.shape_4.setTransform(506.55,648.1);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#999999").s().p("AoAIdQheiOhIiwQhtjqgBkNQCdhvEJhQQEshOFaAAQB3AABzAJQBcCNBJCwQBtDqAAENQicBwkIBPQktBPlZAAQh4AAhygJg");
	this.shape_5.setTransform(506.55,648.1);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f().s("#000000").ss(1,1,1).p("Ar+iLQBOinDyh3QEDh2FGAAQBxAABoANQCKBYBuCNQCjDFAAD0QhOCojxB2QkEB2lGAAQhwAAhogNQiLhYhuiNQijjEAAj1g");
	this.shape_6.setTransform(315.2,647.875);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#999999").s().p("AliITQiLhYhtiNQikjEAAj1QBOinDyh3QEEh2FFAAQBxAABnANQCMBYBtCNQCjDFAAD0QhNCojzB2QkDB2lHAAQhvAAhogNg");
	this.shape_7.setTransform(315.2,647.875);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f().s("#000000").ss(1,1,1).p("ALqAAQAADfjaCdQjbCek1AAQk0AAjbieQjaidAAjfQAAjeDaieQDbieE0AAQE1AADbCeQDaCeAADeg");
	this.shape_8.setTransform(123.85,647.7);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#999999").s().p("AoPF8QjaidAAjfQAAjeDaieQDbidE0gBQE1ABDaCdQDbCeAADeQAADfjbCdQjaCfk1gBQk0ABjbifg");
	this.shape_9.setTransform(123.85,647.7);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.shape_1},{t:this.shape}]},76).to({state:[{t:this.shape_3},{t:this.shape_2}]},1).to({state:[{t:this.shape_5},{t:this.shape_4}]},1).to({state:[{t:this.shape_7},{t:this.shape_6}]},1).to({state:[{t:this.shape_9},{t:this.shape_8}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_Layer_1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(1,1,1).p("AKtAAQAACjjJBzQjJBzkbAAQkbAAjJhzQjIhzAAijQAAiiDIhzQDJhzEbAAQEbAADJBzQDJBzAACig");
	this.shape.setTransform(906.95,210);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#999999").s().p("AnjEWQjJh0AAiiQAAihDJh0QDJhzEaAAQEbAADJBzQDJB0AAChQAACijJB0QjJBykbAAQkaAAjJhyg");
	this.shape_1.setTransform(906.95,210);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#000000").ss(1,1,1).p("ABhueQACAAABAAQBpAABhAKQAlAUAjAWQAMAEAMAEQAdAKAbAMQCzBSAsBxQgJAkgUAhQAMAaAIAcQAHAYAEAaQADARACATQAAABAAABQABAJAAAKQAAAGAAAIQg9B6jUBXQgOAFgPAFIn4BMQgBAAgBAAQhSAAhPgHIg1gFQgCAAgDAAQh4hJhehqQhHhHgmhPIgpilQAAgBAAgBIAAAAQAAgDAAgCAAouhQAfgBAfAAQBlAABeAKQAUAGANACQAjAVAhAZQBKA4A/BIQATASAQAUIBOB4Qg4BdiLBAQjLBWkIAAQkKAAjLhWQiyhSgthxArCp7QAlh6C7hXQDLhWEJAAQAbAAAbABQAdABAcACQCVALCAApQBdA8BEBNQATASAQATArCp4QA8h5DThXQDshWEoAAArCp7QA9h6DThXQDVhNEFgIAKtmVIAAAAQg8B6jUBXQgPAFgPAFAKbHQQALAjAAAmQAACjjJBzQjJB0kaAAQkcAAjJh0QjIhzAAijQAAikDIhzQDJh0EcAAQEaAADJB0QAMAGALAHQA8gPA0gEQB4BWgfB6IgiAEI0oC8QAAh2CXhSQFZhXGWAAQCLhBBwgdQCHBVAgBsgAlRh6QgFAAgFgBQh0hHhdhpQhJhIgkhQArCp4IAAgDArCpzIAAgEQAAAAAAgBArCpqIAAAAQAAgDAAgCQAAgCAAgCArCpqQAAgFAAgE");
	this.shape_2.setTransform(716.5182,265.4);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#999999").s().p("AhwGYQhTAAhOgGIg1gFIgFgBQh4hJhehqQhHhHgnhPIgoikIAAgCIAAAAIAAgJIAAgEIAAgBQA8h5DThXQDshVEogBIADAAQBpAABhAKQAlAUAjAWQBdA9BEBMQATASAQATIBOB4Qg4BciLBAQjLBWkIAAQkKAAjLhWQiyhSgthwQAtBwCyBSQDLBWEKAAQEIAADLhWQCLhAA4hcQAMAbAIAbQAHAXAEAaQADASACASIAAACIABATIAAAOQg9B6jUBXIgdAKIAdgKQDUhXA9h6IAAAAQg8B6jUBXIgeAKIn4BMIgCAAgAGBljQiAgpiVgLQCVALCAApgAlQGLQh0hHhdhpQhJhHglhRQAnBPBHBHQBeBqB4BJIAFABIgKgCgAqPBDIAAAAg");
	this.shape_3.setTransform(715.425,213.475);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f().s("#000000").ss(1,1,1).p("ACJ20QAZgBAaAAQBwAABsAHQAZAcAWAeQBHBbAuBnQABACAAABQANAXALAXIBNFWQAAAAgBABIAAAAQh5BRjeA5QgJACgKACIo2A2QgCAAgCAAIjggIQgIAAgHAAIAAAAQgCgBgCAAQhNhzg+iKQhki2AAjOIAAAAIAAAAQB6hSDdg5QD7g1EcgEQCSANCCAkQAWAHAUAIQALAEAKAEQB4AuA+A9QghArg0AkQAAABAAAAQANAYALAYAA926QBBgCBCAAQBsAABoAGQATAJANABQAVAfATAhQA1BXAsBjQgBAAAAAAQhBAshhAgQjOA6j1AAQj4AAjPg6Qing2hOhLQAAgCAAgBQAAgDAAgDQAAgDAAgDIAAgCQB6hRDfg6QDYgtDxgKQAmACAmAEArlz4QBKhRCug6QDOg5D3AAQAzAAAyACArlzwQAAgDAAgDArlznQAAgFAAgEAnjpuQgIAAgHAAQhQh3g/iNQhgiwgEjFAKhsqQh6BRjfA5QgIACgJACAJqOnQA7hUAyhHQAnA6g+BRIhSAYQAkA9AABFQAACkjJB0QjIB0kbAAQkbAAjJh0QgxgcglggIgmALQAAgUAIgSQhUhXAAhqQAAikDIh0QDJh0EbAAQEbAADIB0QBvBAAyBOgAJiOzQAEgGAEgGQACAEACAEIgMAEIqcDAQEJgQEWAAQBDhfA6hRgApUUNQgQgNgOgOQAUgxBJglQDpgbDygOg");
	this.shape_4.setTransform(527.3067,320.775);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#999999").s().p("AjhGnIjhgHIgOgBQhQh2g/iNQhgivgEjGQBOBMCnA2QDPA5D4AAQD1AADOg5QBgggBCgsIABADIAYAtIBNFWIgBAAQh6BRjfA6IgRADIo2A2IgEAAgAFZFxIAAAAgAFqFuQDfg6B6hRIAAAAQh5BRjeA6IgTADIARgDgALDDjgAG/l0QiCgkiTgOIA0AAQBwAABsAHQAZAcAWAdIgqgOg");
	this.shape_5.setTransform(523.925,216.925);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f().s("#000000").ss(1,1,1).p("Aso91QBvgpChgcQDQgdDkAAQBJAABFADQBKADBJAGQAbAAAbAAQB4AAB2ADQAJAYAKAYQALADAMADQAsALAnANQghARgmAPQgGACgGACQhUAfhpATQjQAdjkAAQjmAAjQgdQidgbhvgmQAAAAAAgBQAAgBAAgCQAAgGAAgGQC3gpDpgcQDVgUDdgGQBmgDBpAAQB0AAByADQARANAPAAQAGAaAGAbQAGAcAGAcQAYBrAUBwQAGAdAGAcIAmGFQi4ApjpAdQgKABgKABIpmAbQgDAAgCAAQiEAAiAgEQgoikgfiwQgNg0gJg1IgclGAH0+YQAMAhALAhQAkBrAUBvQAGAbAGAbAC9/LQBMAHBJAKQBYAPBKATAJ1zBQAAABgBAAQi1AojpAdQgLABgLABAso9pQC1gpDpgdQEbgaEsgCAqvxiQgBAAgBAAQgmihgfirQgOg4gIg5AoYdzIhvAxQAAgeAygQQAegCAfgBQABAAABAAQAAAAAAgBQgPgHgNgIQjIh0AAilQAAilDIh1QDIh1EcAAQEbAADIB1QBWAyAxA7QBCBPAABeQAACei5ByQgIAEgIAFQjIB1kbAAQkIAAjAhlQHYgVHjgEQCFgBCHAAQBGksAzkPQgqAchdAoIiHA7IwyHVg");
	this.shape_6.setTransform(341.4,376.15);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#999999").s().p("AplG0QgmiggfirQgNg4gJg5QAKA0AMA1QAfCvAoCkIgBABIgBgBgAEgGcQDpgdC4gpIgBAAQi1ApjpAdIgWACIAUgCgAGemjQhJgKhMgGIA2gBQB4AAB2ADIATAwQhKgShYgQg");
	this.shape_7.setTransform(333.775,220.2006);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f().s("#000000").ss(1,1,1).p("EAIigoQIAfAAIAAOMI20AAIAAuMIAAgPIWVAAgEgNzgoQIWVAAEAIiAg0QAACmjIB1QjJB1kaAAQkcAAjIh1QjJh1AAimQAAilDJh2QDIh1EcAAQEaAADJB1QDIB2AAClgAJ/cAID2AAIAAMgI4RAAIAAgf");
	this.shape_8.setTransform(156.2,436.125);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#999999").s().p("AraHGIAAuLIWWAAIAfAAIAAOLg");
	this.shape_9.setTransform(140.825,223.85);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.shape_1},{t:this.shape}]},76).to({state:[{t:this.shape_3},{t:this.shape_2}]},1).to({state:[{t:this.shape_5},{t:this.shape_4}]},1).to({state:[{t:this.shape_7},{t:this.shape_6}]},1).to({state:[{t:this.shape_9},{t:this.shape_8}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_background = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// background
	this.instance = new lib._59DarkDesktopBackgroundonWallpaperSafari3();
	this.instance.setTransform(-10,-31,0.5309,0.6791);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(71).to({x:-9,y:-29},0).wait(10));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.___Camera___ = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_0 = function() {
		this.visible = false;
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(2));

	// cameraBoundary
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("rgba(0,0,0,0)").ss(2,1,1,3,true).p("EAq+AfQMhV7AAAMAAAg+fMBV7AAAg");

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-501,-361,1002,722);


(lib.Symbol20 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.an_Video({'id': '', 'src':'videos/Razer%20Viper%20Ultimate%20%20Not%20All%20Wireless%20Mice%20Are%20Created%20Equal.mp4', 'autoplay':false, 'controls':false, 'muted':false, 'loop':false, 'poster':'', 'preload':true, 'class':'video'});

	this.instance.setTransform(200,150,1,1,0,0,0,200,150);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Symbol20, new cjs.Rectangle(-0.5,-0.5,401,301), null);


(lib.Scene_1_Product = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Product
	this.desc2 = new lib.Symbol13();
	this.desc2.name = "desc2";
	this.desc2.setTransform(140.85,623.05,1,1,0,0,0,116.4,17.5);
	new cjs.ButtonHelper(this.desc2, 0, 1, 2, false, new lib.Symbol13(), 3);

	this.desc1 = new lib.Symbol12();
	this.desc1.name = "desc1";
	this.desc1.setTransform(145.2,372,1,1,0,0,0,116.4,17.5);
	new cjs.ButtonHelper(this.desc1, 0, 1, 2, false, new lib.Symbol12(), 3);

	this.instance = new lib.CachedBmp_9();
	this.instance.setTransform(272.4,444.3,0.5,0.5);

	this.instance_1 = new lib.k380multidevicebluetoothkeyboard();
	this.instance_1.setTransform(24,470,0.2769,0.2208);

	this.instance_2 = new lib.CachedBmp_8();
	this.instance_2.setTransform(274.95,213.8,0.5,0.5);

	this.instance_3 = new lib.wirelesstouchkeyboardk400plus1();
	this.instance_3.setTransform(20,235,0.3458,0.2748);

	this.instance_4 = new lib.CachedBmp_7();
	this.instance_4.setTransform(302.8,152.2,0.5,0.5);

	this.home = new lib.Symbol5();
	this.home.name = "home";
	this.home.setTransform(174.7,128.4,1,1,0,0,0,98.2,31.4);
	new cjs.ButtonHelper(this.home, 0, 1, 2, false, new lib.Symbol5(), 3);

	this.about = new lib.Symbol2();
	this.about.name = "about";
	this.about.setTransform(748.55,132.35,1,1,0,0,0,82.6,27.4);
	new cjs.ButtonHelper(this.about, 0, 1, 2, false, new lib.Symbol2(), 3);

	this.instance_5 = new lib.CachedBmp_6();
	this.instance_5.setTransform(115.65,18.95,0.5,0.5);

	this.desc4 = new lib.Symbol15();
	this.desc4.name = "desc4";
	this.desc4.setTransform(103.45,640,1,1,0,0,0,62.8,34);
	new cjs.ButtonHelper(this.desc4, 0, 1, 2, false, new lib.Symbol15(), 3);

	this.desc3 = new lib.Symbol14();
	this.desc3.name = "desc3";
	this.desc3.setTransform(104.4,403.85,1,1,0,0,0,58.7,34);
	new cjs.ButtonHelper(this.desc3, 0, 1, 2, false, new lib.Symbol14(), 3);

	this.text = new cjs.Text("Seri 7.1 kembali hadir dengan gaya GARANG dan Desain HEXAGON dengan RGB kedua sisi headset serta bahan metal di kedua sisinya. Headset ini juga sudah dilengkapi dengan tombol pengaturan lampu RGB yang bisa kamu atur semau kamu langsung dari headset.\nUSB Virtual 7.1 Surround Sound with Software\nOver ear design\nRGB Color\nNoise Cancelling\nAdjustment RGB Color", "23px 'Times New Roman'", "#FFFFFF");
	this.text.lineHeight = 28;
	this.text.lineWidth = 724;
	this.text.parent = this;
	this.text.setTransform(182.15,237.05);

	this.instance_6 = new lib.HEXAGONHG21FANTECHHEADPHONE01300x300();
	this.instance_6.setTransform(25,508,0.4034,0.29);

	this.text_1 = new cjs.Text("Headset CAPTAIN 7.1 HG11 didesain untuk memberikan resonansi terbaik dari speaker 50mm di dalamnya yang di kombinasikan dengan earcup kulit yang sangat lembut yang memberikan isolasi terbaik dari suara luar.efek suara dan equalizer CAPTAIN 7.1 HG11 bisa di setel dengan perangkat lunak yang tersedia di www.fantechworld.com\nDimensi mic : 4.0*1.5mm\nfrekuensi speaker : 20-20kHz\npanjang kabel : 2.2m\nTersedia 2 pilihan warna (HITAM DAN PUTIH)", "23px 'Times New Roman'", "#FFFFFF");
	this.text_1.lineHeight = 28;
	this.text_1.lineWidth = 837;
	this.text_1.parent = this;
	this.text_1.setTransform(182.85,493.35);

	this.instance_7 = new lib.CAPTAINPROHG11FANTECHHEADPHONE03300x300();
	this.instance_7.setTransform(18,243,0.5107,0.4202);

	this.instance_8 = new lib.CachedBmp_11();
	this.instance_8.setTransform(304.65,159.7,0.5,0.5);

	this.instance_9 = new lib.CachedBmp_10();
	this.instance_9.setTransform(115.65,18.95,0.5,0.5);

	this.desc6 = new lib.Symbol17();
	this.desc6.name = "desc6";
	this.desc6.setTransform(111.35,653.9,1,1,0,0,0,65.6,34);
	new cjs.ButtonHelper(this.desc6, 0, 1, 2, false, new lib.Symbol17(), 3);

	this.desc5 = new lib.Symbol16();
	this.desc5.name = "desc5";
	this.desc5.setTransform(105.95,388.55,1,1,0,0,0,64.8,34);
	new cjs.ButtonHelper(this.desc5, 0, 1, 2, false, new lib.Symbol16(), 3);

	this.instance_10 = new lib.CachedBmp_16();
	this.instance_10.setTransform(201.1,450.75,0.5,0.5);

	this.instance_11 = new lib.m350feature032();
	this.instance_11.setTransform(18,489,0.2273,0.3153);

	this.instance_12 = new lib.CachedBmp_15();
	this.instance_12.setTransform(204.25,240.7,0.5,0.5);

	this.instance_13 = new lib.mxanywhere2sgalleryflounder1();
	this.instance_13.setTransform(20,233,0.1671,0.1521);

	this.instance_14 = new lib.CachedBmp_14();
	this.instance_14.setTransform(544.15,163.95,0.5,0.5);

	this.instance_15 = new lib.CachedBmp_13();
	this.instance_15.setTransform(323.15,156.2,0.5,0.5);

	this.instance_16 = new lib.CachedBmp_12();
	this.instance_16.setTransform(115.65,18.95,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_5},{t:this.about},{t:this.home},{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance},{t:this.desc1},{t:this.desc2}]},72).to({state:[{t:this.instance_9},{t:this.about},{t:this.home},{t:this.instance_8},{t:this.instance_7},{t:this.text_1},{t:this.instance_6},{t:this.text},{t:this.desc3},{t:this.desc4}]},1).to({state:[{t:this.instance_16},{t:this.about},{t:this.home},{t:this.instance_15},{t:this.instance_14},{t:this.instance_13},{t:this.instance_12},{t:this.instance_11},{t:this.instance_10},{t:this.desc5},{t:this.desc6}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_logo_3 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// logo_3
	this.instance = new lib.Symbol10();
	this.instance.setTransform(-214,391.1,1,1,0,0,0,112,80.1);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(24).to({_off:false},0).wait(1).to({regX:111.9,x:-177.05,y:389.75},0).wait(1).to({x:-140.05,y:388.4},0).wait(1).to({x:-103.05,y:387.1},0).wait(1).to({x:-66.05,y:385.75},0).wait(1).to({x:-29.05,y:384.4},0).wait(1).to({x:7.95,y:383.1},0).wait(1).to({x:44.95,y:381.75},0).wait(1).to({x:81.95,y:380.4},0).wait(1).to({x:118.9,y:379.1},0).wait(1).to({x:155.9,y:377.75},0).wait(1).to({x:192.9,y:376.4},0).wait(1).to({x:229.9,y:375.1},0).wait(1).to({x:266.9,y:373.75},0).wait(1).to({x:303.9,y:372.4},0).wait(1).to({x:340.9,y:371.1},0).wait(1).to({x:377.9,y:369.75},0).wait(1).to({x:414.9,y:368.4},0).wait(1).to({x:451.9,y:367.1},0).wait(1).to({x:488.9,y:365.75},0).wait(1).to({x:525.95,y:364.45},0).wait(2).to({regY:80.2,x:532.55,y:367.9},0).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_logo_2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// logo_2
	this.instance = new lib.CachedBmp_18();
	this.instance.setTransform(196.6,176.8,0.5,0.5);

	this.instance_1 = new lib.Symbol10();
	this.instance_1.setTransform(503.05,374.05,0.9999,0.9999,0,0,0,112,80.2);

	this.instance_2 = new lib.CachedBmp_19();
	this.instance_2.setTransform(196.6,176.8,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance}]},24).to({state:[{t:this.instance_2},{t:this.instance_1}]},23).wait(24));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_Home = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Home
	this.comingsoon = new lib.Symbol11();
	this.comingsoon.name = "comingsoon";
	this.comingsoon.setTransform(532.95,611.25,1.5023,1.5421,0,0,0,122.5,19.9);
	new cjs.ButtonHelper(this.comingsoon, 0, 1, 2, false, new lib.Symbol11(), 3);

	this.mouse = new lib.Symbol9();
	this.mouse.name = "mouse";
	this.mouse.setTransform(868.3,418.65,1,1,0,0,0,88.7,19.7);
	new cjs.ButtonHelper(this.mouse, 0, 1, 2, false, new lib.Symbol9(), 3);

	this.headset = new lib.Symbol8();
	this.headset.name = "headset";
	this.headset.setTransform(555.2,418.65,1,1,0,0,0,61.5,19.7);
	new cjs.ButtonHelper(this.headset, 0, 1, 2, false, new lib.Symbol8(), 3);

	this.keyboard = new lib.Symbol7();
	this.keyboard.name = "keyboard";
	this.keyboard.setTransform(204.35,418.65,1,1,0,0,0,88.7,19.7);
	new cjs.ButtonHelper(this.keyboard, 0, 1, 2, false, new lib.Symbol7(), 3);

	this.home = new lib.Symbol5();
	this.home.name = "home";
	this.home.setTransform(174.7,128.4,1,1,0,0,0,98.2,31.4);
	new cjs.ButtonHelper(this.home, 0, 1, 2, false, new lib.Symbol5(), 3);

	this.instance = new lib.x17w300x300();
	this.instance.setTransform(723,209,0.7263,0.5754);

	this.instance_1 = new lib._03b();
	this.instance_1.setTransform(73,209,0.1386,0.1302);

	this.instance_2 = new lib.ECHOMH82FANTECHHEADPHONE01300x300();
	this.instance_2.setTransform(428,215,0.6997,0.5365);

	this.about = new lib.Symbol2();
	this.about.name = "about";
	this.about.setTransform(748.55,132.35,1,1,0,0,0,82.6,27.4);
	new cjs.ButtonHelper(this.about, 0, 1, 2, false, new lib.Symbol2(), 3);

	this.instance_3 = new lib.CachedBmp_17();
	this.instance_3.setTransform(115.65,18.95,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_3},{t:this.about},{t:this.instance_2},{t:this.instance_1},{t:this.instance},{t:this.home},{t:this.keyboard},{t:this.headset},{t:this.mouse},{t:this.comingsoon}]},71).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Symbol21 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.movieClip_2 = new lib.Symbol20();
	this.movieClip_2.name = "movieClip_2";
	this.movieClip_2.setTransform(15,105.95,1,1,0,0,0,200,150);

	this.instance = new lib.CachedBmp_68();
	this.instance.setTransform(-231.4,-102.7,0.5,0.5);

	this.home = new lib.Symbol5();
	this.home.name = "home";
	this.home.setTransform(-336.1,-146.5,1,1,0,0,0,98.2,31.4);
	new cjs.ButtonHelper(this.home, 0, 1, 2, false, new lib.Symbol5(), 3);

	this.about = new lib.Symbol2();
	this.about.name = "about";
	this.about.setTransform(237.75,-142.55,1,1,0,0,0,82.6,27.4);
	new cjs.ButtonHelper(this.about, 0, 1, 2, false, new lib.Symbol2(), 3);

	this.instance_1 = new lib.CachedBmp_67();
	this.instance_1.setTransform(-395.15,-255.95,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.about},{t:this.home},{t:this.instance},{t:this.movieClip_2}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Symbol21, new cjs.Rectangle(-395.1,-255.9,777.8,512.4), null);


(lib.Scene_1_About = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// About
	this.instance = new lib.Symbol10();
	this.instance.setTransform(500.5,610.95,1,1,0,0,0,111.9,80.2);

	this.instance_1 = new lib.CachedBmp_3();
	this.instance_1.setTransform(92.3,221.5,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_2();
	this.instance_2.setTransform(388.6,159.9,0.5,0.5);

	this.home = new lib.Symbol5();
	this.home.name = "home";
	this.home.setTransform(174.7,128.4,1,1,0,0,0,98.2,31.4);
	new cjs.ButtonHelper(this.home, 0, 1, 2, false, new lib.Symbol5(), 3);

	this.about = new lib.Symbol2();
	this.about.name = "about";
	this.about.setTransform(748.55,132.35,1,1,0,0,0,82.6,27.4);
	new cjs.ButtonHelper(this.about, 0, 1, 2, false, new lib.Symbol2(), 3);

	this.instance_3 = new lib.CachedBmp_1();
	this.instance_3.setTransform(115.65,18.95,0.5,0.5);

	this.btn_play = new lib.Symbol18();
	this.btn_play.name = "btn_play";
	this.btn_play.setTransform(194.65,412.25,1,1,0,0,0,103.7,60.9);
	new cjs.ButtonHelper(this.btn_play, 0, 1, 1);

	this.btn_stop = new lib.Symbol19();
	this.btn_stop.name = "btn_stop";
	this.btn_stop.setTransform(856.15,423.1,1,1,0,0,0,81.3,76.8);
	new cjs.ButtonHelper(this.btn_stop, 0, 1, 1);

	this.movie = new lib.an_Video({'id': 'movie', 'src':'videos/Razer%20Viper%20Ultimate%20%20Not%20All%20Wireless%20Mice%20Are%20Created%20Equal.mp4', 'autoplay':true, 'controls':false, 'muted':false, 'loop':true, 'poster':'', 'preload':true, 'class':'video'});

	this.movie.name = "movie";
	this.movie.setTransform(526,410.75,1.2456,0.9437,0,0,0,200.1,150.1);

	this.instance_4 = new lib.CachedBmp_5();
	this.instance_4.setTransform(279.4,172.2,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_4();
	this.instance_5.setTransform(115.65,18.95,0.5,0.5);

	this.movieClip_3 = new lib.Symbol21();
	this.movieClip_3.name = "movieClip_3";
	this.movieClip_3.setTransform(510.8,275.1,1,1,0,0,0,0,0.2);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_3},{t:this.about},{t:this.home},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]},75).to({state:[{t:this.instance_5},{t:this.about},{t:this.home},{t:this.instance_4},{t:this.movie},{t:this.btn_stop},{t:this.btn_play}]},1).to({state:[{t:this.movieClip_3}]},4).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


// stage content:
(lib.mulmed = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	this.actionFrames = [0,23,71,72,73,74,75,76,80];
	this.streamSoundSymbolsList[0] = [{id:"GameboyStartupSound",startFrame:0,endFrame:23,loop:0,offset:0}];
	this.___GetDepth___ = function(obj) {
		var depth = obj.depth;
		var cameraObj = this.___camera___instance;
		if(cameraObj && cameraObj.depth && obj.isAttachedToCamera)
		{
			depth += depth + cameraObj.depth;
		}
		return depth;
		}
	this.___needSorting___ = function() {
		for (var i = 0; i < this.numChildren - 1; i++)
		{
			var prevDepth = this.___GetDepth___(this.getChildAt(i));
			var nextDepth = this.___GetDepth___(this.getChildAt(i + 1));
			if (prevDepth < nextDepth)
				return true;
		}
		return false;
	}
	this.___sortFunction___ = function(obj1, obj2) {
		return (this.exportRoot.___GetDepth___(obj2) - this.exportRoot.___GetDepth___(obj1));
	}
	this.on('tick', function (event){
		var curTimeline = event.currentTarget;
		if (curTimeline.___needSorting___()){
			this.sortChildren(curTimeline.___sortFunction___);
		}
	});

	// timeline functions:
	this.frame_0 = function() {
		this.clearAllSoundStreams();
		 
		var soundInstance = playSound("GameboyStartupSound",-1);
		this.InsertIntoSoundStreamData(soundInstance,0,23,0);
	}
	this.frame_23 = function() {
		playSound("GameboyStartupSound");
	}
	this.frame_71 = function() {
		this.about = this.Home.about;
		this.home = this.Home.home;
		this.keyboard = this.Home.keyboard;
		this.headset = this.Home.headset;
		this.mouse = this.Home.mouse;
		this.comingsoon = this.Home.comingsoon;
		this.stop();
		
		
		this.keyboard.addEventListener("click", keyboard.bind(this));
		
		function keyboard()
		{
			this.gotoAndStop(72);
		}
		this.mouse.addEventListener("click", mouse.bind(this));
		
		function mouse()
		{
			this.gotoAndStop(74);
		}
		this.headset.addEventListener("click", headset.bind(this));
		
		function headset()
		{
			this.gotoAndStop(73);
		}
		this.home.addEventListener("click", home.bind(this));
		
		function home()
		{
			this.gotoAndStop(71);
		}
		this.about.addEventListener("click", about.bind(this));
		
		function about()
		{
			this.gotoAndStop(75);
		}
		this.comingsoon.addEventListener("click", comingsoon.bind(this));
		
		function comingsoon()
		{
			this.gotoAndStop(76);
		}
	}
	this.frame_72 = function() {
		this.about = this.Product.about;
		this.home = this.Product.home;
		this.desc1 = this.Product.desc1;
		this.desc2 = this.Product.desc2;
		this.stop();
		
		this.home.addEventListener("click", home.bind(this));
		
		function home()
		{
			this.gotoAndStop(71);
		}
		this.about.addEventListener("click", about.bind(this));
		
		function about()
		{
			this.gotoAndStop(75);
		}
		this.desc1.addEventListener("click", desc1);
		
		function desc1()
		{
			window.open("https://www.logitech.com/id-id/product/wireless-touch-keyboard-k400-plus?crid=27");
		}
		this.desc2.addEventListener("click", desc2);
		
		function desc2()
		{
			window.open("https://www.logitech.com/id-id/product/multi-device-keyboard-k380?crid=27");
		}
	}
	this.frame_73 = function() {
		this.about = undefined;this.home = undefined;this.desc1 = undefined;this.desc2 = undefined;this.about = this.Product.about;
		this.home = this.Product.home;
		this.desc3 = this.Product.desc3;
		this.desc4 = this.Product.desc4;
		this.stop();
		this.home.addEventListener("click", home.bind(this));
		
		function home()
		{
			this.gotoAndStop(71);
		}
		this.about.addEventListener("click", about.bind(this));
		
		function about()
		{
			this.gotoAndStop(75);
		}
		this.desc3.addEventListener("click", desc3);
		
		function desc3()
		{
			window.open("https://www.tokopedia.com/fantechstore/fantech-gaming-headset-hg11-captain-7-1-hitam-non-vibration?src=topads");
		}
		this.desc4.addEventListener("click", desc4);
		
		function desc4()
		{
			window.open("https://fantech.id/product/captain-pro-hg11-7-1/");
		}
	}
	this.frame_74 = function() {
		this.about = undefined;this.home = undefined;this.desc3 = undefined;this.desc4 = undefined;this.about = this.Product.about;
		this.home = this.Product.home;
		this.desc5 = this.Product.desc5;
		this.desc6 = this.Product.desc6;
		this.stop();
		this.home.addEventListener("click", home.bind(this));
		
		function home()
		{
			this.gotoAndStop(71);
		}
		this.about.addEventListener("click", about.bind(this));
		
		function about()
		{
			this.gotoAndStop(75);
		}
		this.desc5.addEventListener("click", desc5);
		
		function desc5()
		{
			window.open("https://www.logitech.com/id-id/product/mx-master-2s-flow?crid=7");
		}
		this.desc6.addEventListener("click", desc6);
		
		function desc6()
		{
			window.open("https://www.logitech.com/id-id/products/mice/m350-pebble-wireless-mouse.910-005602.html?crid=7");
		}
	}
	this.frame_75 = function() {
		this.about = this.About.about;
		this.home = this.About.home;
		this.stop();
		
		this.home.addEventListener("click", home.bind(this));
		
		function home()
		{
			this.gotoAndStop(71);
		}
		this.about.addEventListener("click", about.bind(this));
		
		function about()
		{
			this.gotoAndStop(75);
		}
	}
	this.frame_76 = function() {
		this.about = undefined;this.home = undefined;this.about = this.About.about;
		this.home = this.About.home;
		this.movie = this.About.movie;
		this.btn_stop = this.About.btn_stop;
		this.btn_play = this.About.btn_play;
		this.stop();
		
		this.home.addEventListener("click", home.bind(this));
		
		function home()
		{
			this.gotoAndStop(71);
		}
		this.about.addEventListener("click", about.bind(this));
		
		function about()
		{
			this.gotoAndStop(75);
		}
		
		
		this.btn_play.addEventListener("click", btn_play.bind(this));
		
		function btn_play()
		{
				$("#movie")[0].play();
			
		}
		this.btn_stop.addEventListener("click", btn_stop.bind(this));
		
		function btn_stop()
		{
			
		    $("#movie")[0].pause();
		}
	}
	this.frame_80 = function() {
		this.about = undefined;this.home = undefined;this.movie = undefined;this.btn_stop = undefined;this.btn_play = undefined;this.movieClip_3 = this.About.movieClip_3;
		this.___loopingOver___ = true;
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(23).call(this.frame_23).wait(48).call(this.frame_71).wait(1).call(this.frame_72).wait(1).call(this.frame_73).wait(1).call(this.frame_74).wait(1).call(this.frame_75).wait(1).call(this.frame_76).wait(4).call(this.frame_80).wait(1));

	// Camera
	this.___camera___instance = new lib.___Camera___();
	this.___camera___instance.name = "___camera___instance";
	this.___camera___instance.setTransform(500.05,360);
	this.___camera___instance.depth = 0;
	this.___camera___instance.visible = false;

	this.timeline.addTween(cjs.Tween.get(this.___camera___instance).wait(47).to({scaleX:1.0055,scaleY:1.0055},0).to({scaleX:61.0731,scaleY:61.0731,x:498.3,y:352.3},23).to({_off:true},1).wait(10));

	// About_obj_
	this.About = new lib.Scene_1_About();
	this.About.name = "About";
	this.About.depth = 0;
	this.About.isAttachedToCamera = 1
	this.About.isAttachedToMask = 0
	this.About.layerDepth = 0
	this.About.layerIndex = 0
	this.About.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.About).wait(81));

	// Layer_3_obj_
	this.Layer_3 = new lib.Scene_1_Layer_3();
	this.Layer_3.name = "Layer_3";
	this.Layer_3.setTransform(-0.05,0);
	this.Layer_3.depth = 0;
	this.Layer_3.isAttachedToCamera = 0
	this.Layer_3.isAttachedToMask = 0
	this.Layer_3.layerDepth = 0
	this.Layer_3.layerIndex = 1
	this.Layer_3.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Layer_3).wait(76).to({x:0},0).wait(5));

	// Layer_1_obj_
	this.Layer_1 = new lib.Scene_1_Layer_1();
	this.Layer_1.name = "Layer_1";
	this.Layer_1.setTransform(-0.05,0);
	this.Layer_1.depth = 0;
	this.Layer_1.isAttachedToCamera = 0
	this.Layer_1.isAttachedToMask = 0
	this.Layer_1.layerDepth = 0
	this.Layer_1.layerIndex = 2
	this.Layer_1.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Layer_1).wait(76).to({x:0},0).wait(5));

	// Product_obj_
	this.Product = new lib.Scene_1_Product();
	this.Product.name = "Product";
	this.Product.depth = 0;
	this.Product.isAttachedToCamera = 1
	this.Product.isAttachedToMask = 0
	this.Product.layerDepth = 0
	this.Product.layerIndex = 3
	this.Product.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Product).wait(74).to({_off:true},1).wait(6));

	// Home_obj_
	this.Home = new lib.Scene_1_Home();
	this.Home.name = "Home";
	this.Home.depth = 0;
	this.Home.isAttachedToCamera = 1
	this.Home.isAttachedToMask = 0
	this.Home.layerDepth = 0
	this.Home.layerIndex = 4
	this.Home.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Home).wait(71).to({_off:true},1).wait(9));

	// logo_3_obj_
	this.logo_3 = new lib.Scene_1_logo_3();
	this.logo_3.name = "logo_3";
	this.logo_3.depth = 0;
	this.logo_3.isAttachedToCamera = 1
	this.logo_3.isAttachedToMask = 0
	this.logo_3.layerDepth = 0
	this.logo_3.layerIndex = 5
	this.logo_3.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.logo_3).wait(25).to({regX:159.3,regY:377.8,x:159.3,y:377.8},0).wait(21).to({regX:0,regY:0,x:0,y:0},0).to({_off:true},1).wait(34));

	// logo_2_obj_
	this.logo_2 = new lib.Scene_1_logo_2();
	this.logo_2.name = "logo_2";
	this.logo_2.setTransform(-0.05,0);
	this.logo_2.depth = 0;
	this.logo_2.isAttachedToCamera = 0
	this.logo_2.isAttachedToMask = 0
	this.logo_2.layerDepth = 0
	this.logo_2.layerIndex = 6
	this.logo_2.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.logo_2).wait(47).to({regX:-2.6,regY:-1.9,scaleX:0.9945,scaleY:0.9945,x:0},0).to({_off:true},24).wait(10));

	// maks_logo (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	var mask_graphics_0 = new cjs.Graphics().p("EAASAiUQiWr6AAw2QAAw2CWr8QCYr6DVAAQDWAACXL6QCXL8AAQ2QAAQ2iXL6QiXL8jWAAQjVAAiYr8g");
	var mask_graphics_1 = new cjs.Graphics().p("EAFmAiJQiXr7AAw2QAAw2CXr8QCXr6DWAAQDVAACXL6QCYL8AAQ2QAAQ2iYL7QiXL7jVAAQjWAAiXr7g");
	var mask_graphics_2 = new cjs.Graphics().p("EAK5Ah9QiXr6AAw3QAAw1CXr9QCYr5DVAAQDWAACXL5QCXL9AAQ1QAAQ3iXL6QiXL8jWAAQjVAAiYr8g");
	var mask_graphics_3 = new cjs.Graphics().p("EAQNAhyQiXr7AAw3QAAw1CXr8QCXr6DWAAQDVAACXL6QCYL8AAQ1QAAQ3iYL7QiXL7jVAAQjWAAiXr7g");
	var mask_graphics_4 = new cjs.Graphics().p("EAVgAhmQiXr7AAw2QAAw2CXr8QCYr6DVAAQDWAACXL6QCXL8AAQ2QAAQ2iXL7QiXL7jWAAQjVAAiYr7g");
	var mask_graphics_5 = new cjs.Graphics().p("EAazAhaQiXr6AAw3QAAw2CXr7QCYr7DWAAQDVAACXL7QCXL7AAQ2QAAQ3iXL6QiXL8jVAAQjWAAiYr8g");
	var mask_graphics_6 = new cjs.Graphics().p("EAgHAhOQiXr6AAw3QAAw1CXr8QCXr6DWAAQDWAACWL6QCYL8AAQ1QAAQ3iYL6QiWL8jWAAQjWAAiXr8g");
	var mask_graphics_7 = new cjs.Graphics().p("EAlbAhCQiYr6AAw2QAAw2CYr8QCXr6DWAAQDVAACXL6QCYL8AAQ2QAAQ2iYL6QiXL8jVAAQjWAAiXr8g");
	var mask_graphics_8 = new cjs.Graphics().p("EAquAg3QiXr7AAw2QAAw2CXr8QCYr6DVAAQDWAACWL6QCYL8AAQ2QAAQ2iYL7QiWL7jWAAQjVAAiYr7g");
	var mask_graphics_9 = new cjs.Graphics().p("EAwCAgrQiXr6gBw3QABw1CXr8QCXr6DVAAQDWAACXL6QCYL8AAQ1QAAQ3iYL6QiXL8jWAAQjVAAiXr8g");
	var mask_graphics_10 = new cjs.Graphics().p("EA1VAgfQiXr6AAw2QAAw2CXr8QCYr6DVAAQDWAACXL6QCXL8AAQ2QAAQ2iXL6QiXL8jWAAQjVAAiYr8g");
	var mask_graphics_11 = new cjs.Graphics().p("EA6pAgUQiXr7AAw2QAAw2CXr8QCXr6DVAAQDWAACXL6QCYL8AAQ2QAAQ2iYL7QiXL7jWAAQjVAAiXr7g");
	var mask_graphics_12 = new cjs.Graphics().p("EA14AgXQiXr7AAw2QAAw2CXr8QCYr6DVAAQDWAACXL6QCXL8AAQ2QAAQ2iXL7QiXL7jWAAQjVAAiYr7g");
	var mask_graphics_13 = new cjs.Graphics().p("EAxIAgZQiXr6AAw2QAAw2CXr8QCXr6DWAAQDWAACWL6QCYL8AAQ2QAAQ2iYL6QiWL8jWAAQjWAAiXr8g");
	var mask_graphics_14 = new cjs.Graphics().p("EAsYAgdQiXr7AAw3QAAw1CXr8QCXr6DWAAQDVAACXL6QCYL8AAQ1QAAQ3iYL7QiXL7jVAAQjWAAiXr7g");
	var mask_graphics_15 = new cjs.Graphics().p("EAnoAgfQiXr6AAw3QAAw1CXr8QCXr6DWAAQDVAACXL6QCYL8AAQ1QAAQ3iYL6QiXL8jVAAQjWAAiXr8g");
	var mask_graphics_16 = new cjs.Graphics().p("EAi4AgiQiXr6gBw3QABw1CXr8QCXr6DVAAQDWAACXL6QCYL8AAQ1QAAQ3iYL6QiXL8jWAAQjVAAiXr8g");
	var mask_graphics_17 = new cjs.Graphics().p("EAeHAglQiXr7AAw2QAAw2CXr7QCYr7DVAAQDWAACXL7QCXL7AAQ2QAAQ2iXL7QiXL7jWABQjVgBiYr7g");
	var mask_graphics_18 = new cjs.Graphics().p("EAZXAgoQiXr6AAw3QAAw2CXr7QCXr7DWABQDWgBCWL7QCYL7AAQ2QAAQ3iYL6QiWL8jWAAQjWAAiXr8g");
	var mask_graphics_19 = new cjs.Graphics().p("EAUnAgrQiXr7AAw2QAAw2CXr8QCXr6DWAAQDVAACXL6QCYL8AAQ2QAAQ2iYL7QiXL7jVAAQjWAAiXr7g");
	var mask_graphics_20 = new cjs.Graphics().p("EAP2AguQiWr7AAw2QAAw2CWr8QCYr6DWAAQDVAACXL6QCXL8AAQ2QAAQ2iXL7QiXL7jVAAQjWAAiYr7g");
	var mask_graphics_21 = new cjs.Graphics().p("EALHAgwQiXr6gBw2QABw2CXr8QCXr6DVAAQDWAACXL6QCYL8AAQ2QAAQ2iYL6QiXL8jWAAQjVAAiXr8g");
	var mask_graphics_22 = new cjs.Graphics().p("EAGWAg0QiXr7AAw3QAAw1CXr8QCYr6DVAAQDWAACXL6QCXL8AAQ1QAAQ3iXL7QiXL7jWAAQjVAAiYr7g");
	var mask_graphics_23 = new cjs.Graphics().p("EABmAg2QiWr6AAw3QAAw1CWr8QCXr6DWAAQDWAACWL6QCYL8AAQ1QAAQ3iYL6QiWL8jWAAQjWAAiXr8g");

	this.timeline.addTween(cjs.Tween.get(mask).to({graphics:mask_graphics_0,x:89.925,y:296}).wait(1).to({graphics:mask_graphics_1,x:123.875,y:294.825}).wait(1).to({graphics:mask_graphics_2,x:157.825,y:293.65}).wait(1).to({graphics:mask_graphics_3,x:191.775,y:292.5}).wait(1).to({graphics:mask_graphics_4,x:225.725,y:291.325}).wait(1).to({graphics:mask_graphics_5,x:259.65,y:290.15}).wait(1).to({graphics:mask_graphics_6,x:293.6,y:288.975}).wait(1).to({graphics:mask_graphics_7,x:327.55,y:287.8}).wait(1).to({graphics:mask_graphics_8,x:361.5,y:286.625}).wait(1).to({graphics:mask_graphics_9,x:395.45,y:285.475}).wait(1).to({graphics:mask_graphics_10,x:429.4,y:284.3}).wait(1).to({graphics:mask_graphics_11,x:463.35,y:283.125}).wait(1).to({graphics:mask_graphics_12,x:432.925,y:283.425}).wait(1).to({graphics:mask_graphics_13,x:402.5,y:283.7}).wait(1).to({graphics:mask_graphics_14,x:372.075,y:284}).wait(1).to({graphics:mask_graphics_15,x:341.675,y:284.275}).wait(1).to({graphics:mask_graphics_16,x:311.25,y:284.575}).wait(1).to({graphics:mask_graphics_17,x:280.825,y:284.85}).wait(1).to({graphics:mask_graphics_18,x:250.4,y:285.15}).wait(1).to({graphics:mask_graphics_19,x:219.975,y:285.425}).wait(1).to({graphics:mask_graphics_20,x:189.55,y:285.725}).wait(1).to({graphics:mask_graphics_21,x:159.15,y:286}).wait(1).to({graphics:mask_graphics_22,x:128.725,y:286.3}).wait(1).to({graphics:mask_graphics_23,x:98.3,y:286.575}).wait(58));

	// Logo_obj_
	this.Logo = new lib.Scene_1_Logo();
	this.Logo.name = "Logo";
	this.Logo.setTransform(516.6,315,1,1,0,0,0,516.6,315);
	this.Logo.depth = 0;
	this.Logo.isAttachedToCamera = 1
	this.Logo.isAttachedToMask = 0
	this.Logo.layerDepth = 0
	this.Logo.layerIndex = 7
	this.Logo.maskLayerName = 0

	var maskedShapeInstanceList = [this.Logo];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get(this.Logo).wait(23).to({_off:true},1).wait(57));

	// menu_obj_
	this.menu = new lib.Scene_1_menu();
	this.menu.name = "menu";
	this.menu.depth = 0;
	this.menu.isAttachedToCamera = 1
	this.menu.isAttachedToMask = 0
	this.menu.layerDepth = 0
	this.menu.layerIndex = 8
	this.menu.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.menu).wait(81));

	// background_obj_
	this.background = new lib.Scene_1_background();
	this.background.name = "background";
	this.background.setTransform(499.7,376.4,1,1,0,0,0,499.7,376.4);
	this.background.depth = 0;
	this.background.isAttachedToCamera = 1
	this.background.isAttachedToMask = 0
	this.background.layerDepth = 0
	this.background.layerIndex = 9
	this.background.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.background).wait(81));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(-29599.3,-21335.1,60695.3,43734.8);
// library properties:
lib.properties = {
	id: '1861568C259CFA4984F503A4BF30E570',
	width: 1000,
	height: 720,
	fps: 24,
	color: "#999999",
	opacity: 1.00,
	manifest: [
		{src:"images/mulmed_atlas_1.png?1609927612852", id:"mulmed_atlas_1"},
		{src:"images/mulmed_atlas_2.png?1609927612852", id:"mulmed_atlas_2"},
		{src:"images/mulmed_atlas_3.png?1609927612852", id:"mulmed_atlas_3"},
		{src:"images/mulmed_atlas_4.png?1609927612853", id:"mulmed_atlas_4"},
		{src:"images/mulmed_atlas_5.png?1609927612853", id:"mulmed_atlas_5"},
		{src:"images/mulmed_atlas_6.png?1609927612853", id:"mulmed_atlas_6"},
		{src:"images/mulmed_atlas_7.png?1609927612854", id:"mulmed_atlas_7"},
		{src:"sounds/GameboyStartupSound.mp3?1609927613028", id:"GameboyStartupSound"},
		{src:"https://code.jquery.com/jquery-3.4.1.min.js?1609927613028", id:"lib/jquery-3.4.1.min.js"},
		{src:"components/sdk/anwidget.js?1609927613028", id:"sdk/anwidget.js"},
		{src:"components/video/src/video.js?1609927613028", id:"an.Video"}
	],
	preloads: []
};



// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['1861568C259CFA4984F503A4BF30E570'] = {
	getStage: function() { return exportRoot.stage; },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}

p._getProjectionMatrix = function(container, totalDepth) {	var focalLength = 528.25;
	var projectionCenter = { x : lib.properties.width/2, y : lib.properties.height/2 };
	var scale = (totalDepth + focalLength)/focalLength;
	var scaleMat = new createjs.Matrix2D;
	scaleMat.a = 1/scale;
	scaleMat.d = 1/scale;
	var projMat = new createjs.Matrix2D;
	projMat.tx = -projectionCenter.x;
	projMat.ty = -projectionCenter.y;
	projMat = projMat.prependMatrix(scaleMat);
	projMat.tx += projectionCenter.x;
	projMat.ty += projectionCenter.y;
	return projMat;
}
p._handleTick = function(event) {
	var cameraInstance = exportRoot.___camera___instance;
	if(cameraInstance !== undefined && cameraInstance.pinToObject !== undefined)
	{
		cameraInstance.x = cameraInstance.pinToObject.x + cameraInstance.pinToObject.pinOffsetX;
		cameraInstance.y = cameraInstance.pinToObject.y + cameraInstance.pinToObject.pinOffsetY;
		if(cameraInstance.pinToObject.parent !== undefined && cameraInstance.pinToObject.parent.depth !== undefined)
		cameraInstance.depth = cameraInstance.pinToObject.parent.depth + cameraInstance.pinToObject.pinOffsetZ;
	}
	stage._applyLayerZDepth(exportRoot);
}
p._applyLayerZDepth = function(parent)
{
	var cameraInstance = parent.___camera___instance;
	var focalLength = 528.25;
	var projectionCenter = { 'x' : 0, 'y' : 0};
	if(parent === exportRoot)
	{
		var stageCenter = { 'x' : lib.properties.width/2, 'y' : lib.properties.height/2 };
		projectionCenter.x = stageCenter.x;
		projectionCenter.y = stageCenter.y;
	}
	for(child in parent.children)
	{
		var layerObj = parent.children[child];
		if(layerObj == cameraInstance)
			continue;
		stage._applyLayerZDepth(layerObj, cameraInstance);
		if(layerObj.layerDepth === undefined)
			continue;
		if(layerObj.currentFrame != layerObj.parent.currentFrame)
		{
			layerObj.gotoAndPlay(layerObj.parent.currentFrame);
		}
		var matToApply = new createjs.Matrix2D;
		var cameraMat = new createjs.Matrix2D;
		var totalDepth = layerObj.layerDepth ? layerObj.layerDepth : 0;
		var cameraDepth = 0;
		if(cameraInstance && !layerObj.isAttachedToCamera)
		{
			var mat = cameraInstance.getMatrix();
			mat.tx -= projectionCenter.x;
			mat.ty -= projectionCenter.y;
			cameraMat = mat.invert();
			cameraMat.prependTransform(projectionCenter.x, projectionCenter.y, 1, 1, 0, 0, 0, 0, 0);
			cameraMat.appendTransform(-projectionCenter.x, -projectionCenter.y, 1, 1, 0, 0, 0, 0, 0);
			if(cameraInstance.depth)
				cameraDepth = cameraInstance.depth;
		}
		if(layerObj.depth)
		{
			totalDepth = layerObj.depth;
		}
		//Offset by camera depth
		totalDepth -= cameraDepth;
		if(totalDepth < -focalLength)
		{
			matToApply.a = 0;
			matToApply.d = 0;
		}
		else
		{
			if(layerObj.layerDepth)
			{
				var sizeLockedMat = stage._getProjectionMatrix(parent, layerObj.layerDepth);
				if(sizeLockedMat)
				{
					sizeLockedMat.invert();
					matToApply.prependMatrix(sizeLockedMat);
				}
			}
			matToApply.prependMatrix(cameraMat);
			var projMat = stage._getProjectionMatrix(parent, totalDepth);
			if(projMat)
			{
				matToApply.prependMatrix(projMat);
			}
		}
		layerObj.transformMatrix = matToApply;
	}
}
an.makeResponsive = function(isResp, respDim, isScale, scaleType, domContainers) {		
	var lastW, lastH, lastS=1;		
	window.addEventListener('resize', resizeCanvas);		
	resizeCanvas();		
	function resizeCanvas() {			
		var w = lib.properties.width, h = lib.properties.height;			
		var iw = window.innerWidth, ih=window.innerHeight;			
		var pRatio = window.devicePixelRatio || 1, xRatio=iw/w, yRatio=ih/h, sRatio=1;			
		if(isResp) {                
			if((respDim=='width'&&lastW==iw) || (respDim=='height'&&lastH==ih)) {                    
				sRatio = lastS;                
			}				
			else if(!isScale) {					
				if(iw<w || ih<h)						
					sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==1) {					
				sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==2) {					
				sRatio = Math.max(xRatio, yRatio);				
			}			
		}
		domContainers[0].width = w * pRatio * sRatio;			
		domContainers[0].height = h * pRatio * sRatio;
		domContainers.forEach(function(container) {				
			container.style.width = w * sRatio + 'px';				
			container.style.height = h * sRatio + 'px';			
		});
		stage.scaleX = pRatio*sRatio;			
		stage.scaleY = pRatio*sRatio;
		lastW = iw; lastH = ih; lastS = sRatio;            
		stage.tickOnUpdate = false;            
		stage.update();            
		stage.tickOnUpdate = true;		
	}
}

// Virtual camera API : 

an.VirtualCamera = new function() {
var _camera = new Object();
function VC(timeline) {
	this.timeline = timeline;
	this.camera = timeline.___camera___instance;
	this.centerX = lib.properties.width / 2;
	this.centerY = lib.properties.height / 2;
	this.camAxisX = this.camera.x;
	this.camAxisY = this.camera.y;
	if(timeline.___camera___instance == null || timeline.___camera___instance == undefined ) {
		timeline.___camera___instance = new cjs.MovieClip();
		timeline.___camera___instance.visible = false;
		timeline.___camera___instance.parent = timeline;
		timeline.___camera___instance.setTransform(this.centerX, this.centerY);
	}
	this.camera = timeline.___camera___instance;
}

VC.prototype.moveBy = function(x, y, z) {
z = typeof z !== 'undefined' ? z : 0;
	var position = this.___getCamPosition___();
	var rotAngle = this.getRotation()*Math.PI/180;
	var sinTheta = Math.sin(rotAngle);
	var cosTheta = Math.cos(rotAngle);
	var offX= x*cosTheta + y*sinTheta;
	var offY = y*cosTheta - x*sinTheta;
	this.camAxisX = this.camAxisX - x;
	this.camAxisY = this.camAxisY - y;
	var posX = position.x + offX;
	var posY = position.y + offY;
	this.camera.x = this.centerX - posX;
	this.camera.y = this.centerY - posY;
	this.camera.depth += z;
};

VC.prototype.setPosition = function(x, y, z) {
	z = typeof z !== 'undefined' ? z : 0;

	const MAX_X = 10000;
	const MIN_X = -10000;
	const MAX_Y = 10000;
	const MIN_Y = -10000;
	const MAX_Z = 10000;
	const MIN_Z = -5000;

	if(x > MAX_X)
	  x = MAX_X;
	else if(x < MIN_X)
	  x = MIN_X;
	if(y > MAX_Y)
	  y = MAX_Y;
	else if(y < MIN_Y)
	  y = MIN_Y;
	if(z > MAX_Z)
	  z = MAX_Z;
	else if(z < MIN_Z)
	  z = MIN_Z;

	var rotAngle = this.getRotation()*Math.PI/180;
	var sinTheta = Math.sin(rotAngle);
	var cosTheta = Math.cos(rotAngle);
	var offX= x*cosTheta + y*sinTheta;
	var offY = y*cosTheta - x*sinTheta;
	
	this.camAxisX = this.centerX - x;
	this.camAxisY = this.centerY - y;
	this.camera.x = this.centerX - offX;
	this.camera.y = this.centerY - offY;
	this.camera.depth = z;
};

VC.prototype.getPosition = function() {
	var loc = new Object();
	loc['x'] = this.centerX - this.camAxisX;
	loc['y'] = this.centerY - this.camAxisY;
	loc['z'] = this.camera.depth;
	return loc;
};

VC.prototype.resetPosition = function() {
	this.setPosition(0, 0);
};

VC.prototype.zoomBy = function(zoom) {
	this.setZoom( (this.getZoom() * zoom) / 100);
};

VC.prototype.setZoom = function(zoom) {
	const MAX_zoom = 10000;
	const MIN_zoom = 1;
	if(zoom > MAX_zoom)
	zoom = MAX_zoom;
	else if(zoom < MIN_zoom)
	zoom = MIN_zoom;
	this.camera.scaleX = 100 / zoom;
	this.camera.scaleY = 100 / zoom;
};

VC.prototype.getZoom = function() {
	return 100 / this.camera.scaleX;
};

VC.prototype.resetZoom = function() {
	this.setZoom(100);
};

VC.prototype.rotateBy = function(angle) {
	this.setRotation( this.getRotation() + angle );
};

VC.prototype.setRotation = function(angle) {
	const MAX_angle = 180;
	const MIN_angle = -179;
	if(angle > MAX_angle)
		angle = MAX_angle;
	else if(angle < MIN_angle)
		angle = MIN_angle;
	this.camera.rotation = -angle;
};

VC.prototype.getRotation = function() {
	return -this.camera.rotation;
};

VC.prototype.resetRotation = function() {
	this.setRotation(0);
};

VC.prototype.reset = function() {
	this.resetPosition();
	this.resetZoom();
	this.resetRotation();
	this.unpinCamera();
};
VC.prototype.setZDepth = function(zDepth) {
	const MAX_zDepth = 10000;
	const MIN_zDepth = -5000;
	if(zDepth > MAX_zDepth)
		zDepth = MAX_zDepth;
	else if(zDepth < MIN_zDepth)
		zDepth = MIN_zDepth;
	this.camera.depth = zDepth;
}
VC.prototype.getZDepth = function() {
	return this.camera.depth;
}
VC.prototype.resetZDepth = function() {
	this.camera.depth = 0;
}

VC.prototype.pinCameraToObject = function(obj, offsetX, offsetY, offsetZ) {

	offsetX = typeof offsetX !== 'undefined' ? offsetX : 0;

	offsetY = typeof offsetY !== 'undefined' ? offsetY : 0;

	offsetZ = typeof offsetZ !== 'undefined' ? offsetZ : 0;
	if(obj === undefined)
		return;
	this.camera.pinToObject = obj;
	this.camera.pinToObject.pinOffsetX = offsetX;
	this.camera.pinToObject.pinOffsetY = offsetY;
	this.camera.pinToObject.pinOffsetZ = offsetZ;
};

VC.prototype.setPinOffset = function(offsetX, offsetY, offsetZ) {
	if(this.camera.pinToObject != undefined) {
	this.camera.pinToObject.pinOffsetX = offsetX;
	this.camera.pinToObject.pinOffsetY = offsetY;
	this.camera.pinToObject.pinOffsetZ = offsetZ;
	}
};

VC.prototype.unpinCamera = function() {
	this.camera.pinToObject = undefined;
};
VC.prototype.___getCamPosition___ = function() {
	var loc = new Object();
	loc['x'] = this.centerX - this.camera.x;
	loc['y'] = this.centerY - this.camera.y;
	loc['z'] = this.depth;
	return loc;
};

this.getCamera = function(timeline) {
	timeline = typeof timeline !== 'undefined' ? timeline : null;
	if(timeline === null) timeline = exportRoot;
	if(_camera[timeline] == undefined)
	_camera[timeline] = new VC(timeline);
	return _camera[timeline];
}

this.getCameraAsMovieClip = function(timeline) {
	timeline = typeof timeline !== 'undefined' ? timeline : null;
	if(timeline === null) timeline = exportRoot;
	return this.getCamera(timeline).camera;
}
}


// Layer depth API : 

an.Layer = new function() {
	this.getLayerZDepth = function(timeline, layerName)
	{
		if(layerName === "Camera")
		layerName = "___camera___instance";
		var script = "if(timeline." + layerName + ") timeline." + layerName + ".depth; else 0;";
		return eval(script);
	}
	this.setLayerZDepth = function(timeline, layerName, zDepth)
	{
		const MAX_zDepth = 10000;
		const MIN_zDepth = -5000;
		if(zDepth > MAX_zDepth)
			zDepth = MAX_zDepth;
		else if(zDepth < MIN_zDepth)
			zDepth = MIN_zDepth;
		if(layerName === "Camera")
		layerName = "___camera___instance";
		var script = "if(timeline." + layerName + ") timeline." + layerName + ".depth = " + zDepth + ";";
		eval(script);
	}
	this.removeLayer = function(timeline, layerName)
	{
		if(layerName === "Camera")
		layerName = "___camera___instance";
		var script = "if(timeline." + layerName + ") timeline.removeChild(timeline." + layerName + ");";
		eval(script);
	}
	this.addNewLayer = function(timeline, layerName, zDepth)
	{
		if(layerName === "Camera")
		layerName = "___camera___instance";
		zDepth = typeof zDepth !== 'undefined' ? zDepth : 0;
		var layer = new createjs.MovieClip();
		layer.name = layerName;
		layer.depth = zDepth;
		layer.layerIndex = 0;
		timeline.addChild(layer);
	}
}
function _updateVisibility(evt) {
	var parent = this.parent;
	var detach = this.stage == null || this._off || !parent;
	while(parent) {
		if(parent.visible) {
			parent = parent.parent;
		}
		else{
			detach = true;
			break;
		}
	}
	detach = detach && this._element && this._element._attached;
	if(detach) {
		this._element.detach();
		this.dispatchEvent('detached');
		stage.removeEventListener('drawstart', this._updateVisibilityCbk);
		this._updateVisibilityCbk = false;
	}
}
function _handleDrawEnd(evt) {
	if(this._element && this._element._attached) {
		var props = this.getConcatenatedDisplayProps(this._props), mat = props.matrix;
		var tx1 = mat.decompose(); var sx = tx1.scaleX; var sy = tx1.scaleY;
		var dp = window.devicePixelRatio || 1; var w = this.nominalBounds.width * sx; var h = this.nominalBounds.height * sy;
		mat.tx/=dp;mat.ty/=dp; mat.a/=(dp*sx);mat.b/=(dp*sx);mat.c/=(dp*sy);mat.d/=(dp*sy);
		this._element.setProperty('transform-origin', this.regX + 'px ' + this.regY + 'px');
		var x = (mat.tx + this.regX*mat.a + this.regY*mat.c - this.regX);
		var y = (mat.ty + this.regX*mat.b + this.regY*mat.d - this.regY);
		var tx = 'matrix(' + mat.a + ',' + mat.b + ',' + mat.c + ',' + mat.d + ',' + x + ',' + y + ')';
		this._element.setProperty('transform', tx);
		this._element.setProperty('width', w);
		this._element.setProperty('height', h);
		this._element.update();
	}
}

function _tick(evt) {
	var stage = this.stage;
	stage&&stage.on('drawend', this._handleDrawEnd, this, true);
	if(!this._updateVisibilityCbk) {
		this._updateVisibilityCbk = stage.on('drawstart', this._updateVisibility, this, false);
	}
}
function _componentDraw(ctx) {
	if(this._element && !this._element._attached) {
		this._element.attach($('#dom_overlay_container'));
		this.dispatchEvent('attached');
	}
}
an.handleSoundStreamOnTick = function(event) {
	if(!event.paused){
		var stageChild = stage.getChildAt(0);
		if(!stageChild.paused){
			stageChild.syncStreamSounds();
		}
	}
}


})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;