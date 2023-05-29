import { useLocalStorage } from "./hooks/useLocalStorage";

type Props = {
    boardId: string
    accessToken: string
    setBoardId: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setAccessToken: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function Settings(props: Props) {
    const {boardId, accessToken, setBoardId, setAccessToken} = props;

    return (
        <form>
            <div>
                <label>Miro's board URL
                    <input
                        type="text"
                        placeholder="Enter Miro's board URL"
                        value={boardId}
                        onChange={setBoardId}
                        />
                </label>
            </div>
            <div>
                <label>Miro's access token
                    <input
                        type="text"
                        placeholder="Enter Miro's access token"
                        value={accessToken}
                        onChange={setAccessToken}
                        />
                </label>
            </div>
        </form>
    );
}

export default Settings;
