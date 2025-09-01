import './Folder.css';
import { useState } from "react";

function Folder({explorer, oFile}){
  const [expand, setExpand]  = useState(false)

  const openFile = (filePath) => {
    oFile(filePath);
  }


  if(typeof explorer === 'object'){
    if(explorer.type == 'folder'){
        return(
          <a href="#" style={{textDecoration:"none", color:"inherit"}}>
            <div className="folder" onClick={() => setExpand(!expand)}>
              <i className="material-symbols-outlined">{!expand ? "expand_more" : "chevron_right"}</i>
              <i className="material-symbols-outlined">{!expand ? "folder" : "folder_open"}</i>
              <p>{explorer.name}</p>
            </div>  
            <div className="folder-content" path={explorer.path} style={{display: expand ? "flex" : "none"}}>
              {explorer.items.map((item) => {
                return <Folder explorer={item} oFile={oFile}/>;
              })}
            </div>
          </a>
        )
    }else if(explorer.type == 'file'){
    return(
      <a href="#" style={{textDecoration:"none", color:"inherit"}}>
        <div className="file" onClick={() => openFile(explorer.path)}>
          <i className="material-symbols-outlined">draft</i>
          <p>{explorer.name}</p>
        </div>
      </a>
    )
  }
}
}

export default Folder;