import React, { useState, useEffect } from 'react'
import { faPlus, faFileImport } from '@fortawesome/free-solid-svg-icons'
import SimpleMDE from 'react-simplemde-editor'
import {v4 as uuidv4} from 'uuid'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'easymde/dist/easymde.min.css'
import FileSearch from './component/FileSearch'
import FileList from './component/FileList'
import defaultFiles from './utils/defaultFiles'
import ButtonBtn from './component/ButtonBtn'
import TabList from './component/TabList'

function App() {
  const [files, setFiles] = useState(defaultFiles)
  const [activeFileID, setActiveFileID] = useState('')
  const [openedFileIDs, setOpenedFileIDs] = useState([])
  const [unsavedFileIDs, setUnsavedFileIDs] = useState([])
  const [searchedFiles, setSearchedFiles] = useState([])
  const openedFiles = openedFileIDs.map((openID) => {
    return files.find((file) => file.id === openID)
  })
  const activeFile = files.find((file) => file.id === activeFileID)
  const fileClick = (fileID) => {
    // set current active file
    setActiveFileID(fileID)
    // if openedFiles don't have the current ID
    // add new fileID to openedFile
    if (!openedFileIDs.includes(fileID)) {
      setOpenedFileIDs([...openedFileIDs, fileID])
    }
  }
  const tabClick = (fileID) => {
    setActiveFileID(fileID)
  }
  const tabClose = (id) => {
    const tabsWithout = openedFileIDs.filter((fileID) => fileID !== id)
    setOpenedFileIDs(tabsWithout)
    if (tabsWithout.length > 0) {
      setActiveFileID(tabsWithout[tabsWithout.length - 1])
    } else {
      setActiveFileID('')
    }
  }
  const fileChange = (id, value) => {
    const newFiles = files.map((file) => {
      if (file.id === id) {
        file.body = value
      }
      return file
    })
    setFiles(newFiles)
    //update unsavedIDs
    if (!unsavedFileIDs.includes(id)) {
      setUnsavedFileIDs([...unsavedFileIDs, id])
    }
  }
  const deleteFile = (id) => {
    const newFiles = files.filter(file => file.id !== id)
    setFiles(newFiles)
    tabClose(id)
  }
  const updateFileName = (id, title) => {
    const newFiles = files.map(file => {
      if(file.id === id){
        file.title = title
        file.isNew = false
      }
      return file
    })
    setFiles(newFiles)
  }
  const fileSearch = (keyword) => {
    const newFiles = files.filter(file => file.title.includes(keyword))
    setSearchedFiles(newFiles)
  }
  const fileListArr = (searchedFiles.length > 0 ? searchedFiles : files)
  const createNewFile = () => {
    const newID = uuidv4()
    const newFiles = [
      ...files,
      {
        id: newID,
        title: '',
        body: '## 标题',
        createdAt: new Date().getTime(),
        isNew: true,
      }
    ]
    setFiles(newFiles)
  }

  return (
    <div className="App container-fluid px-0">
      <div className="row no-gutters">
        <div className="col-3 bg-light left-panel">
          <FileSearch
            onFileSearch={fileSearch}
          />
          <FileList
            files={fileListArr}
            onFileClick={fileClick}
            onFileDelete={deleteFile}
            onSaveEdit={updateFileName}
          />
          <div className="row no-gutters button-group">
            <div className="col">
              <ButtonBtn colorClass="btn-primary" icon={faPlus} onBtnClick={createNewFile} />
            </div>
            <div className="col">
              <ButtonBtn
                text="导入"
                colorClass="btn-success"
                icon={faFileImport}
              />
            </div>
          </div>
        </div>
        <div className="col-9 right-panel">
          {!activeFile && (
            <div className="start-page">选择或者创建新的 MarkDown 文档</div>
          )}
          {activeFile && (
            <>
              <TabList
                files={openedFiles}
                activeId={activeFileID}
                unsaveIds={unsavedFileIDs}
                onTabClick={tabClick}
                onCloseTab={tabClose}
              />
              <SimpleMDE
                key={activeFile && activeFile.id}
                value={activeFile && activeFile.body}
                onChange={(value) => {
                  fileChange(activeFile.id, value)
                }}
                options={{
                  minHeight: '415px',
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
