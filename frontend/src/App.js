import React, { useState, useEffect, useRef } from 'react';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
import './App.css';

const customStyleMap = {
  HIGHLIGHT: {
    backgroundColor: 'yellow',
  },
  RED_TEXT: {
    color: 'red',
  },
}; 
const mediaBlockRenderer = (block) => {
  if (block.getType() === 'atomic') {
    return {
      editable: false,
    };
  }
  return null;
};

const App = () => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [userId, setUserId] = useState(null);
  const [authors, setAuthors] = useState([]);
  const editorRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = new WebSocket('ws://localhost:3001');
  
    socketRef.current.onmessage = async (event) => {
      const data = JSON.parse(event.data);
  
      if (data.type === 'ASSIGN_USER') {
        setUserId(data.userId);
      } else if (data.type === 'CONTENT_UPDATE') {
        const rawContent = data.content;
        const contentState = convertFromRaw(rawContent);
        setEditorState(EditorState.createWithContent(contentState));
  
        setAuthors((prevAuthors) => {
          const updatedAuthors = [...prevAuthors, `Author: ${data.userId}`];
          return Array.from(new Set(updatedAuthors));
        });
      }
    };
  
    return () => {
      socketRef.current.close();
    };
  }, []);
  
  

  const onEditorChange = (newState) => {
    setEditorState(newState);

    const content = newState.getCurrentContent();
    const rawContent = convertToRaw(content);

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'CONTENT_CHANGE',
        userId: userId,
        content: rawContent,
      }));
    }
  };

  const toggleInlineStyle = (style) => {
    const newState = RichUtils.toggleInlineStyle(editorState, style);
    if (newState) {
      setEditorState(newState);
    }
    editorRef.current.focus();
  };

  const toggleBlockType = (blockType) => {
    const newState = RichUtils.toggleBlockType(editorState, blockType);
    if (newState) {
      setEditorState(newState);
    }
    editorRef.current.focus();
  };

  return (
    <div className="App">
      <div className="toolbar">
        <AllStyleControls editorState={editorState} onToggleInline={toggleInlineStyle} onToggleBlock={toggleBlockType} />
      </div>

      <div
        className="editor"
        onClick={() => editorRef.current.focus()}
      >
        <Editor
          ref={editorRef}
          editorState={editorState}
          onChange={onEditorChange}
          placeholder="Type here..."
          customStyleMap={customStyleMap}
          blockRendererFn={mediaBlockRenderer}
        />
      </div>

      <div className="authors">
        <h3>Authors who made changes:</h3>
        <ul>
          {authors.map((author, index) => (
            <li key={index}>{author}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const AllStyleControls = ({ editorState, onToggleInline, onToggleBlock }) => {
  const STYLES = [
    { label: 'H1', style: 'header-one', type: 'block' },
    { label: 'H2', style: 'header-two', type: 'block' },
    { label: 'Blockquote', style: 'blockquote', type: 'block' },
    { label: 'UL', style: 'unordered-list-item', type: 'block' },
    { label: 'OL', style: 'ordered-list-item', type: 'block' },
    { label: 'Code Block', style: 'code-block', type: 'block' },
    { label: 'Bold', style: 'BOLD', type: 'inline' },
    { label: 'Italic', style: 'ITALIC', type: 'inline' },
    { label: 'Underline', style: 'UNDERLINE', type: 'inline' },
    { label: 'Strikethrough', style: 'STRIKETHROUGH', type: 'inline' },
    { label: 'Highlight', style: 'HIGHLIGHT', type: 'inline' },
    { label: 'Red Text', style: 'RED_TEXT', type: 'inline' },
  ];

  const currentStyle = editorState.getCurrentInlineStyle();
  const selection = editorState.getSelection();
  const blockType = editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType();

  return (
    <div className="RichEditor-controls">
      {STYLES.map((type) => (
        <StyleButton
          key={type.label}
          active={type.type === 'block' ? blockType === type.style : currentStyle.has(type.style)}
          label={type.label}
          onToggle={type.type === 'block' ? onToggleBlock : onToggleInline}
          style={type.style}
        />
      ))}
    </div>
  );
};

const StyleButton = ({ active, label, onToggle, style }) => {
  const onToggleClick = (e) => {
    e.preventDefault();
    onToggle(style);
  };

  let className = 'RichEditor-styleButton';
  if (active) {
    className += ' RichEditor-activeButton';
  }

  return (
    <span className={className} onMouseDown={onToggleClick}>
      {label}
    </span>
  );
};

export default App;