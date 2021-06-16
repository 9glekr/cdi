import {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';

const { kakao } = window;

const useStyles = makeStyles({
    root: {
        width: window.innerWidth,
        height: window.innerHeight
    }
});

const Map = () => {

    const classes = useStyles();

    const [map, setMap] = useState();
    const [myLocationOverlay, setMyLocationOverlay] = useState({});
    const [autoLocation, setAutoLocation] = useState(false);

    const [refresh, setRefresh] = useState(true);

    const kakaoMap = (() => {

        const markerImageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

        /**
         * initialize
         * @returns {Promise<Map<any, any> | *>}
         */
        async function initialize() {
            const position = await getPosition();
            // 맵 생성
            makeMap();
        }

        /**
         * 맵 생성
         * @param position 실시간 위치 정보
         * @returns {Map<any, any> | *}
         */
        function makeMap(position) {
            if (!isEmptyMap()) return;

            const container = document.getElementById('myMap');
            const options = {
                center: (() => {
                    if (position) {
                        return new kakao.maps.LatLng(position.coords.latitude, position.coords.longitude)
                    } else {
                        return new kakao.maps.LatLng(33.50621457703129, 126.49260830819038)
                    }
                })(),
                level: 5,
                animate: true
            };
            // 맵 생성
            setMap(new kakao.maps.Map(container, options));
        }

        /**
         * 실시간 교통상황
         */
        function addTRAFFIC() {
            // 실시간 교통상황
            map.addOverlayMapTypeId(kakao.maps.MapTypeId.TRAFFIC);
        }


        /**
         * 즐겨찾기
         * @type {function(): *[]}
         */
        const getBookmarkList = (() => {
            return [
                { title: '!', content: '', latlng: new kakao.maps.LatLng(33.50621457703129, 126.49260830819038) },
                /*{ title: 'SK제주렌터카', content: '1구역 8승강장 탑승', latlng: new kakao.maps.LatLng(33.49410570464006, 126.45021706453184) },
                { title: '한라수목원', content: '', latlng: new kakao.maps.LatLng(33.47004089300059, 126.49106838651365) },
                { title: '금오름', content: '', latlng: new kakao.maps.LatLng(33.351073513606224, 126.3057296610338) },
                { title: '오셜록티뮤지엄', content: '', latlng: new kakao.maps.LatLng(33.30535175704833, 126.28951908209946) },
                { title: '카멜리아힐', content: '', latlng: new kakao.maps.LatLng(33.29039062256073, 126.36818166726451) },*/
            ];
        });

        /**
         * 오버레이 생성
         * @deprecated
         * @type {Function}
         */
        const devMakeOverlay = (position => {
            var content = '<div class="overlaybox">' +
                '    <div class="boxtitle">' + position.title + '</div>' +
                // '    <div class="first">' +
                // '        <div class="triangle text">1</div>' +
                // '        <div class="movietitle text">드래곤 길들이기2</div>' +
                // '    </div>' +
                '    <ul>' +
                '        <li>' +
                '            <textarea class="title" disabled>' + position.content + '</textarea>' +
                '        </li>' +
                // '        <li>' +
                // '            <span class="number">3</span>' +
                // '            <span class="title">해적(바다로 간 산적)</span>' +
                // '            <span class="arrow up"></span>' +
                // '            <span class="count">6</span>' +
                // '        </li>' +
                // '        <li>' +
                // '            <span class="number">4</span>' +
                // '            <span class="title">해무</span>' +
                // '            <span class="arrow up"></span>' +
                // '            <span class="count">3</span>' +
                // '        </li>' +
                // '        <li>' +
                // '            <span class="number">5</span>' +
                // '            <span class="title">안녕, 헤이즐</span>' +
                // '            <span class="arrow down"></span>' +
                // '            <span class="count">1</span>' +
                // '        </li>' +
                '    </ul>' +
                '</div>';

            // 커스텀 오버레이를 생성합니다
            var customOverlay = new kakao.maps.CustomOverlay({
                position: position.latlng,
                content: content,
                //xAnchor: 0.3, yAnchor: 0.91,
                xAnchor: 0.12,
                yAnchor: 0.34
            });

            // 커스텀 오버레이를 지도에 표시합니다
            customOverlay.setMap(map);
        });

        /**
         * 위치 정보 구하기
         * @type {function(): Promise<any>}
         */
        const getPosition = (async () => {
            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            })
        });

        /**
         * 마커 생성
         * @type {Function}
         */
        function addMarker() {
            if (isEmptyMap()) return;

            const positions = getBookmarkList();

            for (var i = 0; i < positions.length; i ++) {
                // 마커 이미지의 이미지 크기 입니다
                var imageSize = new kakao.maps.Size(24, 35);

                // 마커 이미지를 생성합니다
                var markerImage = new kakao.maps.MarkerImage(markerImageSrc, imageSize);

                // 마커를 생성합니다
                new kakao.maps.Marker({
                    map: map, // 마커를 표시할 지도
                    position: positions[i].latlng, // 마커를 표시할 위치
                    title : positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
                    image : markerImage // 마커 이미지
                });

                // 오버레이 생성
                devMakeOverlay(positions[i]);

            }
        }

        /**
         * 내 위치로 이동
         */
        function myLocations() {
            if (isEmptyMap()) return;

            setAutoLocation(!autoLocation);
        }

        async function moveLocation(test) {
            if (isEmptyMap()) return;

            const position = await getPosition();
            const coords = position.coords;

            if (myLocationOverlay.Eb) {
                //myLocationOverlay.setMap(null);
                //myLocationOverlay.setPosition(new kakao.maps.LatLng(coords.latitude, coords.longitude));

                myLocationOverlay.setOptions({
                    center : new kakao.maps.LatLng(coords.latitude, coords.longitude),  // 원의 중심좌표 입니다
                    radius: Math.pow(2, map.getLevel()),
                    strokeWeight: 1, // 선의 두께입니다
                    strokeColor: '#000', // 선의 색깔입니다
                    strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                    fillColor: '#FA0000', // 채우기 색깔입니다
                    fillOpacity: 0.7  // 채우기 불투명도 입니다
                });

                setRefresh(true);
            } else {
                setMyLocationOverlay(new kakao.maps.Circle({
                    center : new kakao.maps.LatLng(coords.latitude, coords.longitude),  // 원의 중심좌표 입니다
                    radius: Math.pow(2, map.getLevel()),
                    strokeWeight: 1, // 선의 두께입니다
                    strokeColor: '#000', // 선의 색깔입니다
                    strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                    fillColor: '#FA0000', // 채우기 색깔입니다
                    fillOpacity: 0.7  // 채우기 불투명도 입니다
                }));
            }


            // 이동할 위도 경도 위치를 생성합니다
            //var moveLatLon = new kakao.maps.LatLng(coords.latitude, coords.longitude);
            // 지도 중심을 부드럽게 이동시킵니다
            // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
            //map.panTo(moveLatLon);

        }

        /**
         * 클릭한 위치의 위도, 경도 정보 구하기
         * @deprecated
         * @type {Function}
         */
        function devGetPosition() {
            // 지도를 클릭한 위치에 표출할 마커입니다
            var marker = new kakao.maps.Marker({
                // 지도 중심좌표에 마커를 생성합니다
                // position: map.getCenter()
            });
            // 지도에 마커를 표시합니다
            marker.setMap(map);

            kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
                // 클릭한 위도, 경도 정보를 가져옵니다
                var latlng = mouseEvent.latLng;

                // 마커 위치를 클릭한 위치로 옮깁니다
                marker.setPosition(latlng);

                console.log(latlng.getLat() + ", "+ latlng.getLng());
            });
        }


        /**
         * 맵 객체 검사
         * @returns {boolean}
         */
        function isEmptyMap() {
            return map === undefined;
        }

        return {
            initialize,
            myLocations,
            moveLocation,
            addMarker,
            addTRAFFIC,
            devGetPosition
        }

    })();


    /**
     * 1초 간격으로 현 위치를 갱신
     */
    useEffect(() => {
/*
        const reloadTimeout = setTimeout(() => {
            kakaoMap.moveLocation();
        }, 2500);

        return () => clearTimeout(reloadTimeout);
*/
    }, [map, myLocationOverlay, refresh]);
    /**
     * 맵 생성
     */
    useEffect(() => {
/*
        if( map === undefined ) return;

        // 실시간 교통정보 생성
        kakaoMap.addTRAFFIC();
        // 마커 생성
        kakaoMap.addMarker();
        // 개발용
        kakaoMap.devGetPosition();

        // 지도가 확대 또는 축소되면 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
        kakao.maps.event.addListener(map, 'zoom_changed', function() {
            console.log('zoom changed');
            // 지도의 현재 레벨을 얻어옵니다
            // kakaoMap.myLocations();
            console.log(myLocationOverlay);
        });
*/
    }, [map]);
    /**
     * 현 위치 마커 표시
     */
    useEffect(() => {
/*
        if( map === undefined || myLocationOverlay.Eb === null || !refresh) return;

        myLocationOverlay.setMap(map);

        setRefresh(false);
*/
    }, [myLocationOverlay, refresh]);
    /**
     * 최초 생성
     */
    useEffect(() => {
/*
        kakaoMap.initialize();
*/
    }, []);

    return (<>
        <div className='map-controls'>
            <Button variant="outlined" onClick={kakaoMap.myLocations}>내위치</Button>
        </div>
        <Card className={classes.root} id="myMap" onClick={kakaoMap.click}></Card>
    </>);
}



export default Map;