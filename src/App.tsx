import { useEffect, useState } from 'react'
import './App.css'
import { useLocalStorage } from './hooks/useLocalStorage';
import Settings from './Settings';

function App() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVisibleSetting, setIsVisibleSetting] = useState(false);
  const [boardId, setBoardId] = useLocalStorage<string>("boardId", "");
  const [accessToken, setAccessToken] = useLocalStorage<string>("accessToken", "");

  const isSettingEmpty = () => boardId.length === 0 || accessToken.length === 0;

  useEffect(() => {
    if (isSettingEmpty()) setIsVisibleSetting(true);
  }, [])

  const toggleVisibleSetting = () => setIsVisibleSetting(!isVisibleSetting);

  const handleClickButton = (e: any) => {
    e.preventDefault();
    if (isSettingEmpty()) return alert('You setup first!');
    if (input.length === 0) return alert('input something!');
    
    const data = {
      "data": {
        "content": input,
        "shape": "square"
          },
          "position": {
            "origin": "center",
            "x": 0,
            "y": 0
      }
    };
        
    setIsLoading(true);
    fetch(`https://api.miro.com/v2/boards/${boardId}/sticky_notes`, {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      alert('POST Succeed');
    })
    .catch((error) => {
      console.error('Error:', error);
    })
    .finally(() => {
      setIsLoading(false);
      setInput('');
    });
  }

  return (
    <div style={{width: "full"}} className="App">
      <h1>memomiro</h1>
      <p>Memo on Miro, easier!</p>
      <form action="*" method="POST" onSubmit={handleClickButton}>
        <div>
          <textarea style={
            {
              width: "18rem",
              height: "8rem",
            }
          } placeholder='memo something' value={input} onChange={(e) => setInput(e.target.value)} />
        </div>
        <div>
          <button onClick={handleClickButton} disabled={isLoading}>Memo!</button>
        </div>
      </form>
      <hr style={{margin:"0.5rem"}} />
      <button onClick={() => toggleVisibleSetting()}>{isSettingEmpty() ? "You setup first!" : "Show Setting"}</button>
      {isVisibleSetting && (
        <>
          <p style={{
            textAlign: "left",
          }}>
            <Settings boardId={boardId} accessToken={accessToken} setBoardId={(e) => setBoardId(e.target.value)} setAccessToken={(e) => setAccessToken(e.target.value)}  />
            <h3>How to Setup</h3>
            <ol>
              <li>You can get access_token according to below links.</li>
              <ol type='i'>
                <li><a href='https://developers.miro.com/docs/try-out-the-rest-api-in-less-than-3-minutes'>Video: try the REST API in less than 3 minutes</a></li>
                <li><a href='https://developers.miro.com/docs/rest-api-build-your-first-hello-world-app'>Quickstart</a></li>
              </ol>
              <li>You can get board_id from url you want use Miro's board.<br/>
                  ex:) https://miro.com/app/board/<b>[board_id is here]</b>/
              </li>
              <li>After that, input something and Click "Memo!", you can make sticky notes on your miro!</li>
            </ol>
          </p>
        </>
      )}
      <p style={{marginTop: "8px"}}><em>※This App is compliant for PWA, you can install in Home screen.</em></p>
    </div>
  )
}

export default App
