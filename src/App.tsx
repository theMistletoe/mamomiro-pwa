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

    // https://miro.com/app/board/uXjVP-OfE4I=/ からboardIdを抽出する
    const extractedBoardId = boardId.split("/")[5];
        
    setIsLoading(true);
    fetch(`https://api.miro.com/v2/boards/${extractedBoardId}/sticky_notes`, {
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
      <button
        style={isSettingEmpty() ? {
          color: "red"
        } : {}}
        onClick={() => toggleVisibleSetting()}
      >
          {isSettingEmpty() ? "↓You setup first!↓" : "Show Setting"}
      </button>
      {isVisibleSetting && (
        <>
          <p style={{
            textAlign: "left",
          }}>
            <Settings boardId={boardId} accessToken={accessToken} setBoardId={(e) => setBoardId(e.target.value)} setAccessToken={(e) => setAccessToken(e.target.value)}  />
            <h3>How to Setup</h3>
            <p><a href='https://www.notion.so/Memomiro-Wiki-a27ce4bf4c93477f9c123e844d20db8a'>Check Wiki Page!</a></p>
          </p>
        </>
      )}
      <p style={{marginTop: "8px"}}><em>※This App is compliant for PWA, you can install in Home screen.</em></p>
      <footer>@2022 <a href='https://github.com/theMistletoe'>theMistletoe</a> All Right Reserved.</footer>
    </div>
  )
}

export default App
