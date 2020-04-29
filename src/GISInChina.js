function checkChina(point, list){
    //检查类型
    if(point==undefined||point==null||point.lat ==undefined||point.lat ==null){
        return false;
    }
    //检查是否在多多边形外的大矩形中(这里的矩形就是中国所在的大矩形,如果是某个区域,则需要更改这个值)
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
function test() {
    alert("ok")
}
