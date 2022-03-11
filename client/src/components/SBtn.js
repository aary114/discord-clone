import React from 'react'
import {setServer} from '../features/serverSlice'
import { selectServer } from '../features/serverSlice'
import { useSelector, useDispatch} from 'react-redux'

export default function SBtn(props) {
    let currentServer = useSelector(selectServer)
    const dispatch = useDispatch();
    let profile = props.profile
    let name = props.name
    let id = props.uid
    function setCurrentServer(name, id) {
        dispatch(setServer({
            serverName:name,
            serverId: id
        }))
    }
    return (
        <>
            <div onClick={()=>{setCurrentServer(name, id)}}>
                <div className={id===currentServer.server.serverId ?'active-server circle-btn square-btn': 'circle-btn'}><img src={profile} alt={name} className="server-image" /></div>
            </div>
        </>
    )
}