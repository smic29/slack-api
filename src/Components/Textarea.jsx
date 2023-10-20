import './Textarea.css'

function TypeBox(props) {
    const { body, setBody, handleSend } = props

    return(
        <div className="Typebox-CONTAINER">
            <textarea
            placeholder="Hello World!"
            rows={5}
            cols={80}
            value={body}
            onChange={(e) => setBody(e.target.value)}></textarea>
            <button className="Typebox-sendBtn"
            onClick={handleSend}
            disabled={body === ''}>Send</button>
        </div>
    )
}

export default TypeBox