import React, {useEffect} from 'react'
import SBtn from './SBtn'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import {selectUser} from '../features/userSlice'
import {setServer} from '../features/serverSlice'
import { useSelector, useDispatch} from 'react-redux'

export default function ServerList(props) {
    const dispatch = useDispatch();
    let [server, setServerL] = React.useState([]);
    var socket = props.socket;
    const user = useSelector(selectUser)
    function setCurrentServer(s) {
        if(s !== undefined){
        dispatch(setServer({
            serverName:s.serverName,
            serverId: s._id
        }))}
    }
    function GetServerList(){
        fetch('http://localhost:4000/api/get/server', {
            method: "POST",
            url: "http://localhost:4000/api/get/server",
            credentials: 'include',
            withCredentials: true,
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:3001/',
                'Access-Control-Allow-Credentials': 'true',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: user.id })
        }).then(response => response.json()).then(res=>{
            if(res.error === 'null'){
                setServerL(res.servers)
            }
            setCurrentServer(res.servers[res.servers.length - 1])
        })
    }
    useEffect(()=>{
        server.map((s)=>{
            socket.emit("server-connected", s._id);
        })
        // console.log(props)
    },[server])
    function createServer() {
        let name = prompt('server name')
        fetch('http://localhost:4000/api/register/server', {
            method: "POST",
            credentials: 'include',
            withCredentials: true,
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:3001/',
                'Access-Control-Allow-Credentials': 'true',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: name, admin: user.id })
        }).then(response => response.json()).then(res=>{
            if (res.status === 'done'){
                GetServerList()
            }
        })
    }

    useEffect(()=>{
        GetServerList()
    },[])
    return (
        <>
            <div className='server-list'>
                {server.map(servers => (
                    <SBtn key={servers._id} uid={servers._id} profile={servers.ServerProfile} name={servers.serverName}></SBtn>
                ))}
                <div onClick={createServer}>
                    <div className='circle-btn'><FontAwesomeIcon icon={faPlus} color="green" /></div>
                </div>
            </div>
        </>
    )
}