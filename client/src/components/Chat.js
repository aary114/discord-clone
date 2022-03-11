import React, { useEffect } from 'react'
import ImojiButton from './ImojiButton'
import ChatDisplay from './ChatDisplay'
import { selectChannel } from '../features/channelSlice'
import { selectUser } from '../features/userSlice'
import { selectServer } from '../features/serverSlice'
import { useSelector } from 'react-redux'

export default function Chat(props) {
    let chatContainer = React.createRef();
    const scrollToMyRef = () => {
        const scroll =
            chatContainer.current.scrollHeight -
            chatContainer.current.clientHeight;
        chatContainer.current.scrollTo(0, scroll);
    };
    var socket = props.socket
    let currentChannel = useSelector(selectChannel)
    let currentUser = useSelector(selectUser)
    let [message, setMessage] = React.useState('')
    let [messageList, setMessageList] = React.useState([])
    let [previousMessageList, setPreviousMessageList] = React.useState([])
    let user = props.user
    let [response, setResponse] = React.useState([]) 
    useEffect(() => {
        socket.on('msg', (a) => {
            setResponse(a)
        })
        socket.on('joined', () => { console.log('you joined') });
        socket.on('user-connected', () => { console.log("user-connected") })
        socket.on('hehe', () => { console.log("hehe") })
    }, [])
    useEffect(() => {
        if (response[3] === currentChannel.channel.channelId) {
            setMessageList(b => [...b, response])
        }
        else if(response.length!==0){
            alert('new message')
        }
    },[response])
    useEffect(() => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Credentials': 'true',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ channelId: currentChannel.channel.channelId })
        };
        fetch('http://localhost:4000/api/get/chat', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.error === null) {
                    setMessageList([])
                    setPreviousMessageList(data.chat);
                }
            });
            socket.emit('join-room', currentChannel.channel.channelId)
    }, [currentChannel.channel])
    useEffect(() => {
        scrollToMyRef()
    }, [messageList, previousMessageList])
    function handleSubmit(e) {
        e.preventDefault()
        console.log(message)
        socket.emit('send-msg', message, currentChannel.channel.channelId, currentUser.id)
        setMessageList(b => [...b, [message, currentUser.name, currentUser.profile]])
        setMessage('')
    }

    return (
        <div className='chat-section'>
            <div className='chat-header noselect'><h2>#</h2> <h4>{currentChannel.channel.channelName}</h4></div>
            <div className='chat-display' ref={chatContainer}>

                {previousMessageList.map(message => (
                    <ChatDisplay key={message._id} from={message.by} profileImage={message.senderProfile} date={message.time} msg={message.message}></ChatDisplay>
                ))}
                {messageList.map((message,ind )=> (
                    <ChatDisplay key={ind} from={message[1]} profileImage={message[2]} date={message[4]} msg={message[0]}></ChatDisplay>
                ))}
            </div>
            <div className='chat-input'>
                <div className='chat-input-btns'>
                    <form onSubmit={handleSubmit}>
                        <input type="text" placeholder={`Message #${currentChannel.channel.channelName}`} value={message} onChange={(e) => setMessage(e.target.value)} />
                    </form>
                    <div className="gif-icon noselect"><h5>GIF</h5></div>
                    <ImojiButton></ImojiButton>
                </div>
            </div>
        </div>
    )
}