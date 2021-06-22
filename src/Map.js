import {useEffect} from 'react';
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

    useEffect(() => {

        const getPosition = (async () => {
            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            })
        });

        const makerOptions = ((position, level) => {
            return {
                center : position,  // 원의 중심좌표 입니다
                radius: Math.pow(2, level),
                strokeWeight: 1, // 선의 두께입니다
                strokeColor: '#000', // 선의 색깔입니다
                strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                fillColor: '#FA0000', // 채우기 색깔입니다
                fillOpacity: 0.7  // 채우기 불투명도 입니다
            };
        });
        const refresh = ((map, maker) => {
            (async () => {
                let position = await getPosition();

                // 이동할 위도 경도 위치를 생성합니다
                const moveLatLon = new kakao.maps.LatLng(position.coords.latitude, position.coords.longitude);
                // 지도 중심을 부드럽게 이동시킵니다
                // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
                //map.panTo(moveLatLon);

                maker.setOptions(makerOptions(moveLatLon, map.getLevel()));

            })();
        });

        const makeMap = async () => {
            const position = await getPosition();
            const coords = position.coords;
            const moveLatLon = new kakao.maps.LatLng(coords.latitude, coords.longitude);

            let isRefreshChecked = true;
            let beforeLevel = -1;

            let maker = new kakao.maps.Circle(makerOptions(moveLatLon, 5));

            const container = document.getElementById('map');
            const options = {
                center: moveLatLon,
                level: 5,
                animate: true
            };
            // 맵 생성
            const map = new kakao.maps.Map(container, options);
            // 실시간 교통상황
            map.addOverlayMapTypeId(kakao.maps.MapTypeId.TRAFFIC);

            maker.setMap(map);

            kakao.maps.event.addListener(map, 'idle', function() {
                console.log('idle');

                isRefreshChecked = true;

                refresh(map, maker);

            });
            kakao.maps.event.addListener(map, 'dragstart', function() {
                console.log('dragstart');

                //maker.setMap(null);
                console.log(beforeLevel , " vs " , map.getLevel());

            });
            kakao.maps.event.addListener(map, 'drag', function() {
                console.log('drag');

                console.log(beforeLevel , " vs " , map.getLevel());
                isRefreshChecked = false;
            });
            kakao.maps.event.addListener(map, 'dragend', function() {
                console.log('dragend');
                isRefreshChecked = true;
            });
            kakao.maps.event.addListener(map, 'bounds_changed', function() {
                console.log('bounds_changed');
            });
            kakao.maps.event.addListener(map, 'tilesloaded', function() {
                console.log('tilesloaded');
                isRefreshChecked = true;
                beforeLevel = map.getLevel();
            });
            kakao.maps.event.addListener(map, 'center_changed', function() {
                console.log('center_changed');
            });
            kakao.maps.event.addListener(map, 'zoom_start', function() {
                console.log('zoom_start');

                console.log(beforeLevel , " vs " , map.getLevel());

                //maker.setMap(null);
            });
            // 지도가 확대 또는 축소되면 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
            kakao.maps.event.addListener(map, 'zoom_changed', function() {
                console.log('zoom_changed')

                console.log(beforeLevel , " vs " , map.getLevel());
                /*
                if(map.getLevel() === 1) {
                    map.setZoomable(false);
                    return;
                }
                map.setZoomable(true);
                */

                console.log(isRefreshChecked)
                if(isRefreshChecked) refresh(map, maker);
            });

            setInterval(() => {
                console.log(isRefreshChecked)

                if(isRefreshChecked) refresh(map, maker);
            }, 2000);
        };

        makeMap();

    }, []);

    const fff = () => {}

    return (<>
        <div className='map-controls'>
        {/*<Button variant="outlined" onClick={fff}>내위치</Button>*/}
        </div>
        <Card className={classes.root} id="map" onClick={fff}></Card>
    </>);
}



export default Map;