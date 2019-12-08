# GISInChina
判断坐标点是否在国内(区域内)

这里规定:
要判断的坐标点叫做给定点
国内或者区域所在的是一组坐标点的集合叫做多边形点


区域是一多个坐标点的集合,这里通过射线法来判断一个点是否在一个区域内

这个区域的获得方式的几种方法,
1.百度地图的鼠标绘制工具来获取区域内的点 ,这个点的集合就是overlays数组中对象的ia属性 . http://lbsyun.baidu.com/jsdemo.htm#f0_7
2.百度地图的行政区获取指定省,多个省来一起判断(精准)  http://lbsyun.baidu.com/jsdemo.htm#c1_10,
3.第三方途径获取

这里要确定给定点和多边形点是同属于一个坐标系这样才才不会有误差. 如果是google的给定点最好从google获取多边形点

这里所用到的射线法来自于百度
http://api.map.baidu.com/library/GeoUtils/1.2/examples/simple.html

为了方便这里附该算法,有一点点的修改


```
function checkChina(point, list){
   //检查类型
   if(point==undefined||point==null||point.lat ==undefined||point.lat ==null){
     return false;
   }
   //检查是否在多多边形外的大矩形中(这里的矩形就是中国所在的大矩形)
   if(point.lng < 73.66 || point.lng > 135.05 || point.lat < 3.86 || point.lat > 53.55){
     return false2;
   }

   var N = list.length;
   var boundOrVertex = true; //如果点位于多边形的顶点或边上，也算做点在多边形内，直接返回true
   var intersectCount = 0;//cross points count of x
   var precision = 2e-10; //浮点类型计算时候与0比较时候的容差
   var p1, p2;//neighbour bound vertices
   var p = point; //测试点

   p1 = list[0];//left vertex
   for(var i = 1; i <= N; ++i){//check all rays
     console.info(i)
     if(p.lat==p1.lat && p.lng==p1.lng){
       return boundOrVertex;//p is an vertex
     }

     p2 = list[i % N];//right vertex
     if(p.lat < Math.min(p1.lat, p2.lat) || p.lat > Math.max(p1.lat, p2.lat)){//ray is outside of our interests
       p1 = p2;
       continue;//next ray left point
     }

     if(p.lat > Math.min(p1.lat, p2.lat) && p.lat < Math.max(p1.lat, p2.lat)){//ray is crossing over by the algorithm (common part of)
       if(p.lng <= Math.max(p1.lng, p2.lng)){//x is before of ray
         if(p1.lat == p2.lat && p.lng >= Math.min(p1.lng, p2.lng)){//overlies on a horizontal ray
           return boundOrVertex;
         }

         if(p1.lng == p2.lng){//ray is vertical
           if(p1.lng == p.lng){//overlies on a vertical ray
             return boundOrVertex;
           }else{//before ray
             ++intersectCount;
           }
         }else{//cross point on the left side
           var xinters = (p.lat - p1.lat) * (p2.lng - p1.lng) / (p2.lat - p1.lat) + p1.lng;//cross point of lng
           if(Math.abs(p.lng - xinters) < precision){//overlies on a ray
             return boundOrVertex;
           }

           if(p.lng < xinters){//before ray
             ++intersectCount;
           }
         }
       }
     }else{//special case when ray is crossing through the vertex
       if(p.lat == p2.lat && p.lng <= p2.lng){//p crossing over p2
         var p3 = list[(i+1) % N]; //next vertex
         if(p.lat >= Math.min(p1.lat, p3.lat) && p.lat <= Math.max(p1.lat, p3.lat)){//p.lat lies between p1.lat & p3.lat
           ++intersectCount;
         }else{
           intersectCount += 2;
         }
       }
     }
     p1 = p2;//next ray left point
   }

   if(intersectCount % 2 == 0){//偶数在多边形外
     return false;
   } else { //奇数在多边形内
     return true;
   }
 }

//随机点
let point3 ={lng:116.740188,lat:41.053335}
let point2 ={lng:105.177487,lat:21.811124}
let point1 ={lng:114.82687,lat:40.725227}
let point ={lng:177.662837,lat:41.504397}

//自己框线出来的中国多边形,包括南海和台湾 不是很精确
 let list =[{lng:87.635665,lat:49.09606},{lng:90.8,lat:47.375566},{lng:90.873589,lat:45.441471},{lng:91.903838,lat:45.02549},{lng:93.596389,lat:45.02549},{lng:95.877654,lat:43.865731},{lng:96.539957,lat:42.682796},{lng:101.102486,lat:42.682796},{lng:104.929124,lat:41.587326},{lng:107.799102,lat:42.574109},{lng:110.006778,lat:42.46523},{lng:111.920097,lat:43.759149},{lng:111.478562,lat:44.395768},{lng:112.50881,lat:45.181842},{lng:113.39188,lat:44.711491},{lng:117.512875,lat:46.569624},{lng:120.088497,lat:46.721669},{lng:117.95441,lat:48.021404},{lng:115.820324,lat:47.773958},{lng:115.893913,lat:48.756615},{lng:116.850572,lat:49.863235},{lng:117.807232,lat:49.624791},{lng:119.646961,lat:50.289467},{lng:119.426194,lat:50.383669},{lng:120.750799,lat:52.588482},{lng:120.235675,lat:52.767395},{lng:121.265924,lat:53.43178},{lng:123.767956,lat:53.563421},{lng:126.12281,lat:52.901098},{lng:127.88895,lat:49.72031},{lng:129.875858,lat:49.288987},{lng:130.832518,lat:48.707933},{lng:131.053285,lat:47.823542},{lng:132.377891,lat:47.724325},{lng:135.17428,lat:48.561603},{lng:133.113783,lat:44.921015},{lng:131.789177,lat:45.337763},{lng:130.979696,lat:44.921015},{lng:131.274053,lat:43.330905},{lng:130.68534,lat:42.628476},{lng:129.949448,lat:42.899598},{lng:128.256896,lat:41.807947},{lng:128.177295,lat:41.295406},{lng:126.815896,lat:41.737895},{lng:124.203479,lat:39.893029},{lng:123.945917,lat:37.441367},{lng:124.828987,lat:33.807375},{lng:122.731696,lat:24.219246},{lng:121.995804,lat:21.146645},{lng:119.714539,lat:18.148968},{lng:119.052236,lat:14.597252},{lng:118.610701,lat:10.549917},{lng:115.814312,lat:7.257026},{lng:112.576388,lat:3.348032},{lng:108.087447,lat:6.521545},{lng:110.442301,lat:11.785269},{lng:109.779999,lat:15.669558},{lng:109.044107,lat:16.523337},{lng:107.940269,lat:19.550277},{lng:108.161037,lat:21.491439},{lng:107.966172,lat:21.59126},{lng:107.809795,lat:21.642872},{lng:107.589027,lat:21.574052},{lng:107.524637,lat:21.599863},{lng:107.469445,lat:21.642872},{lng:107.29467,lat:21.720256},{lng:107.064704,lat:21.771821},{lng:106.991115,lat:21.840546},{lng:107.046307,lat:21.917822},{lng:107.018711,lat:21.960734},{lng:106.68756,lat:22.003634},{lng:106.705957,lat:22.140824},{lng:106.68756,lat:22.277879},{lng:106.567977,lat:22.363469},{lng:106.632368,lat:22.619921},{lng:106.715155,lat:22.577212},{lng:106.843937,lat:22.816207},{lng:106.659964,lat:22.892937},{lng:106.503587,lat:22.927025},{lng:106.34721,lat:22.850314},{lng:106.255223,lat:22.85884},{lng:106.227627,lat:22.978141},{lng:106.034456,lat:22.995175},{lng:105.924072,lat:22.927025},{lng:105.850483,lat:22.995175},{lng:105.583722,lat:23.06329},{lng:105.574523,lat:23.199417},{lng:105.316961,lat:23.369377},{lng:105.243372,lat:23.275926},{lng:105.041001,lat:23.224925},{lng:104.811035,lat:23.088825},{lng:104.875426,lat:22.952585},{lng:104.70985,lat:22.816207},{lng:104.608665,lat:22.833262},{lng:104.397096,lat:22.696762},{lng:104.249918,lat:22.765029},{lng:104.277514,lat:22.85884},{lng:104.111938,lat:22.79062},{lng:104.010753,lat:22.525944},{lng:103.973958,lat:22.517398},{lng:103.652006,lat:22.782091},{lng:103.587615,lat:22.756498},{lng:103.587615,lat:22.671153},{lng:103.514026,lat:22.602839},{lng:103.440437,lat:22.713832},{lng:103.431238,lat:22.79062},{lng:103.339252,lat:22.816207},{lng:103.28406,lat:22.696762},{lng:103.182875,lat:22.628461},{lng:103.173676,lat:22.53449},{lng:103.081689,lat:22.457557},{lng:102.888518,lat:22.568669},{lng:102.575764,lat:22.7309},{lng:102.511373,lat:22.765029},{lng:102.400989,lat:22.688226},{lng:102.410188,lat:22.619921},{lng:102.253811,lat:22.466107},{lng:102.272208,lat:22.406244},{lng:102.115831,lat:22.406244},{lng:102.042242,lat:22.457557},{lng:101.950256,lat:22.431903},{lng:101.895064,lat:22.380581},{lng:101.803077,lat:22.491755},{lng:101.766283,lat:22.508851},{lng:101.701892,lat:22.483206},{lng:101.665098,lat:22.440455},{lng:101.6467,lat:22.329239},{lng:101.600707,lat:22.269317},{lng:101.563912,lat:22.269317},{lng:101.637502,lat:21.943571},{lng:101.793879,lat:21.814778},{lng:101.766283,lat:21.71166},{lng:101.821475,lat:21.59126},{lng:101.738687,lat:21.556841},{lng:101.729488,lat:21.350157},{lng:101.839872,lat:21.212203},{lng:101.711091,lat:21.134547},{lng:101.58231,lat:21.23808},{lng:101.343145,lat:21.212203},{lng:101.223562,lat:21.19495},{lng:101.205165,lat:21.350157},{lng:101.205165,lat:21.462148},{lng:101.205165,lat:21.556841},{lng:101.122377,lat:21.763228},{lng:101.057987,lat:21.780414},{lng:100.717637,lat:21.496589},{lng:100.036937,lat:21.668671},{lng:99.963348,lat:22.012212},{lng:99.190661,lat:22.183668},{lng:99.595402,lat:22.969623},{lng:99.26425,lat:23.105845},{lng:98.933099,lat:23.241927},{lng:98.896304,lat:24.156785},{lng:97.645288,lat:23.886393},{lng:97.755672,lat:24.291764},{lng:97.608494,lat:24.763046},{lng:98.749126,lat:25.933318},{lng:98.710651,lat:27.57283},{lng:98.416294,lat:27.540035},{lng:97.937964,lat:28.32437},{lng:97.496429,lat:28.58453},{lng:97.165278,lat:27.638391},{lng:94.70004,lat:27.965597},{lng:92.492365,lat:26.518515},{lng:92.161213,lat:27.343056},{lng:91.498911,lat:27.900236},{lng:89.438413,lat:28.161442},{lng:88.960084,lat:27.145723},{lng:88.739316,lat:27.86754},{lng:87.120354,lat:27.802118},{lng:82.189878,lat:30.259596},{lng:81.086041,lat:30.003718},{lng:79.099132,lat:31.02319},{lng:78.657597,lat:32.407128},{lng:79.393489,lat:32.594222},{lng:78.657597,lat:34.076716},{lng:78.878365,lat:34.626044},{lng:77.627349,lat:35.232131},{lng:74.904549,lat:37.140985},{lng:74.904549,lat:38.425889},{lng:73.800711,lat:38.945018},{lng:74.021479,lat:39.744985},{lng:75.640441,lat:40.759911},{lng:76.081976,lat:40.254366},{lng:76.891457,lat:40.310727},{lng:76.891457,lat:40.927572},{lng:78.142473,lat:41.094805},{lng:80.20297,lat:42.144001},{lng:80.938862,lat:43.391024},{lng:80.20297,lat:44.822616},{lng:81.969111,lat:45.447669},{lng:82.852181,lat:45.083893},{lng:82.484235,lat:45.809099},{lng:83.220127,lat:47.18123},{lng:85.280624,lat:46.828837},{lng:85.795749,lat:47.030491},{lng:85.574981,lat:48.224389},{lng:86.60523,lat:48.567447},{lng:87.046765,lat:49.150139},{lng:87.856246,lat:48.956666}];

let re =this.checkChina(point,list)

alert(re)

```
