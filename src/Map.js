import {useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';

const { kakao } = window;

const useStyles = makeStyles({
    root: {
        width: window.innerWidth,
        height: window.innerHeight
    }
});

const Map = () => {

    const classes = useStyles();

    const kakaoMap = (() => {
        let map;
        const markerImageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";
        /**
         *
         * @type {function(): Promise<any>}
         */
        const getPosition = (async () => {
            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            })
        });
        const devOverlay = (position => {
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

            // 커스텀 오버레이가 표시될 위치입니다
            //var position = new kakao.maps.LatLng(x, y);
            //var position = new kakao.maps.LatLng(33.50621457703129, 126.49260830819038);

            // 커스텀 오버레이를 생성합니다
            var customOverlay = new kakao.maps.CustomOverlay({
                position: position.latlng,
                content: content,
                xAnchor: 0.3,
                yAnchor: 0.91,
                xAnchor: 0.12,
                yAnchor: 0.34
            });

            // 커스텀 오버레이를 지도에 표시합니다
            customOverlay.setMap(map);
        });
        const devGetPosition = (()=> {
            // 지도를 클릭한 위치에 표출할 마커입니다
            var marker = new kakao.maps.Marker({
                // 지도 중심좌표에 마커를 생성합니다
                position: map.getCenter()
            });
            // 지도에 마커를 표시합니다
            marker.setMap(map);

            kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
                // 클릭한 위도, 경도 정보를 가져옵니다
                var latlng = mouseEvent.latLng;

                // 마커 위치를 클릭한 위치로 옮깁니다
                marker.setPosition(latlng);

                console.log(latlng , latlng.getLat() + ", "+ latlng.getLng());
            });
        });
        /**
         * 즐겨찾기
         * @type {function(): *[]}
         */
        const getBookmarkList = (() => {
            return [
                { title: 'SK제주렌터카', content: '1구역 8승강장 탑승', latlng: new kakao.maps.LatLng(33.49410570464006, 126.45021706453184) },
                { title: '한라수목원', content: '', latlng: new kakao.maps.LatLng(33.47004089300059, 126.49106838651365) },
                { title: '금오름', content: '', latlng: new kakao.maps.LatLng(33.351073513606224, 126.3057296610338) },
                { title: '오셜록티뮤지엄', content: '', latlng: new kakao.maps.LatLng(33.30535175704833, 126.28951908209946) },
                { title: '카멜리아힐', content: '', latlng: new kakao.maps.LatLng(33.29039062256073, 126.36818166726451) },
            ];
        });
        /**
         *
         * @type {Function}
         */
        const makeMarker = (() => {
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

                devOverlay({ title: 'TEST', latlng: new kakao.maps.LatLng(33.50621457703129, 126.49260830819038) });

                devOverlay(positions[i]);

            }
        });
        /**
         *
         * @returns {Promise<Map<any, any> | *>}
         */
        async function initialize() {
            const position = await getPosition();
            const container = document.getElementById('myMap');
            const options = {
                //center: new kakao.maps.LatLng(position.coords.latitude, position.coords.longitude),
                center: new kakao.maps.LatLng(33.50621457703129, 126.49260830819038),
                level: 3,
                animate: true
            };

            map = new kakao.maps.Map(container, options);

            map.addOverlayMapTypeId(kakao.maps.MapTypeId.TRAFFIC);

            makeMarker();

            //dev
            devGetPosition();

            return map;
        }
        /**
         *
         */
        function click() {
        }

        return { initialize, click }

    })();

    useEffect(() => {
        kakaoMap.initialize();
    }, []);

    return (<Card className={classes.root} id="myMap" onClick={kakaoMap.click}></Card>);
}



export default Map;