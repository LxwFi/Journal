import React from 'react';
import './index.css';
import moment from 'moment';
import { useAuth0 } from "@auth0/auth0-react";
const { useState, useEffect, useRef } = React;

function useJournal() {

    const [entries, setEntries] = useState([]);

    const getEntriesFromStorage = () => JSON.parse(
        window.localStorage.getItem('journalEntries')
    );
    const setEntriesToStorage = items =>
        window.localStorage.setItem('journalEntries', JSON.stringify(items));
    useEffect(() => {
        const entriesFromStorage = getEntriesFromStorage();
        if (entriesFromStorage) {
            setEntries(entriesFromStorage);
        }
    }, []);

    const storeEntry = (entry) => {
        const newEntries = [entry, ...entries];
        setEntries(newEntries);
        setEntriesToStorage(newEntries);
    }

    const removeEntry = (index) => {
        const newEntries = [...entries.slice(0, index), ...entries.slice(index + 1)];
        setEntries(newEntries);
        setEntriesToStorage(newEntries);
    }

    return [entries, storeEntry, removeEntry];
}

function EntryList({ list, deleteEntry }) {
    const handleDeleteClick = (index) => e => {
        deleteEntry(index);
    }
    return (
        <div className="entry-list mt-3">
            {
                list && list.map((item, i) => {
                    const itemDate = moment().format('dddd, MMMM Do YYYY, h:mm a');
                    const flagColor = item.flag ? `bg-${item.flag} text-white` : '';
                    return (
                        <div className={`card mb-2 ${flagColor}`}>
                            <div className="card-body">
                                <h4 className="card-title">{itemDate}</h4>
                                <p className="card-text">{item.message}</p>
                                <button className="btn btn-sm btn-danger"
                                    onClick={handleDeleteClick(i)}>Delete</button>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

function Entry({ addEntry }) {
    const [message, setMessage] = useState('');
    const [flag, setFlag] = useState('');
    const fieldRef = useRef();
    const handleOnChange = e => setMessage(e.target.value);
    const handleFlagChange = e => setFlag(e.target.value);
    const handleOnSubmit = e => {
        e.preventDefault();
        if (message && message.trim().length > 0) {
            addEntry({
                message,
                flag,
                date: Date.now()
            });
            setMessage('');
            setFlag('');
        }
    }

    useEffect(() => {
        fieldRef.current.focus();
    }, []);

    return (
        <form onSubmit={handleOnSubmit}>
            <div className="form-group">
                <label htmlFor="message">What do you wish to record:</label>
                <textarea
                    className="form-control"
                    value={message}
                    onChange={handleOnChange}
                    type="text"
                    id="message"
                    maxLength={100}
                    ref={fieldRef}
                />
            </div>
            <div class="form-check form-check-inline mb-3">
                <input className="form-check-input"
                    id="flagDanger" type="radio" name="flag"
                    value="danger" defaultChecked={flag === 'danger'}
                    onChange={handleFlagChange} />
                <label className="form-check-label bg-danger text-white mr-2 pl-2 pr-2"
                    htmlFor="flagDanger">Critical</label>
                <input className="form-check-input"
                    id="flagGreen" type="radio" name="flag"
                    value="success" defaultChecked={flag === 'success'}
                    onChange={handleFlagChange} />
                <label className="form-check-label bg-success text-white mr-2 pl-2 pr-2"
                    htmlFor="flagGreen">Normal</label>
                <input className="form-check-input"
                    id="flagInfo" type="radio" name="flag"
                    value="dark" defaultChecked={flag === 'dark'}
                    onChange={handleFlagChange} />
                <label className="form-check-label bg-dark text-white pl-2 pr-2"
                    htmlFor="flagInfo">Info</label>
            </div>
            <button disabled={message.trim().length === 0 || !flag}
                className="btn btn-success form-control"
                type="submit">Submit</button>
        </form>
    );
}
function App() {

    const { isAuthenticated } = useAuth0();

    const [entries, storeEntry, removeEntry] = useJournal();
    const handleAddEntry = (entry) => storeEntry(entry);
    const handleDeleteEntry = (index) => removeEntry(index);
    if (isAuthenticated) {
        return (
            <div className="container">
                <h1 className="text-center">
                    <a
                        href={`https://dev.to/chaituknag/a-simple-journal-app-using-react-localstorage-and-fun-23j8`}
                        target="_blank"
                    >Journal</a>
                </h1>
                <Entry addEntry={handleAddEntry} />
                <EntryList list={entries} deleteEntry={handleDeleteEntry} />
            </div>
        )
    } else {
        return (
            <h1 className="text-center">Please log in or visit the about section.</h1>
        )
    }

}

export default App;