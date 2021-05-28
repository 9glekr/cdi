import './App.css';
import axios from 'axios';

function App() {
  const handlerClick = e => {
	//window.location.reload();
	axios.get('https://source.unsplash.com/random/1920x1080').then(res=>{
		const img = e.target;
		img.style.backgroundImage = 'URL(' + res.request.responseURL + ')';
	});
  };
	
  return (
    <div className="App" onClick={handlerClick}>
    </div>
  );
}

export default App;
