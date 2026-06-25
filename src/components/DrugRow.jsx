import { useState, useRef, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { COMMON_DRUGS, FREQUENCY_OPTIONS, DURATION_OPTIONS } from '../data/drugs';
import { getSavedDrugs } from '../utils/storage';

export default function DrugRow({ row, index, onChange, onRemove, isLast }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSug, setShowSug] = useState(false);
  const [focusedSug, setFocusedSug] = useState(-1);
  const inputRef = useRef(null);
  const dropRef = useRef(null);

  const allDrugs = [...new Set([...getSavedDrugs(), ...COMMON_DRUGS])];

  function handleDrugInput(val) {
    onChange(index, 'drug', val);
    if (val.length >= 2) {
      const filtered = allDrugs.filter(d => d.toLowerCase().includes(val.toLowerCase())).slice(0, 10);
      setSuggestions(filtered);
      setShowSug(filtered.length > 0);
    } else {
      setShowSug(false);
    }
    setFocusedSug(-1);
  }

  function selectSuggestion(drug) {
    onChange(index, 'drug', drug);
    setShowSug(false);
    setFocusedSug(-1);
  }

  function handleKeyDown(e) {
    if (!showSug) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedSug(f => Math.min(f + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedSug(f => Math.max(f - 1, -1));
    } else if (e.key === 'Enter' && focusedSug >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[focusedSug]);
    } else if (e.key === 'Escape') {
      setShowSug(false);
    }
  }

  useEffect(() => {
    function handleClick(e) {
      if (dropRef.current && !dropRef.current.contains(e.target) && !inputRef.current?.contains(e.target)) {
        setShowSug(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      {/* # */}
      <td className="px-2 py-1.5 text-center text-gray-500 text-sm w-8">{index + 1}</td>

      {/* Drug Name */}
      <td className="px-2 py-1.5 relative drug-autocomplete">
        <input
          ref={inputRef}
          type="text"
          value={row.drug}
          onChange={e => handleDrugInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => row.drug.length >= 2 && setShowSug(suggestions.length > 0)}
          placeholder="Drug name..."
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-200"
        />
        {showSug && (
          <ul ref={dropRef} className="drug-autocomplete-list">
            {suggestions.map((s, i) => (
              <li
                key={s}
                onMouseDown={() => selectSuggestion(s)}
                className={`px-3 py-1.5 text-sm cursor-pointer ${i === focusedSug ? 'bg-green-100 text-green-800' : 'hover:bg-gray-100'}`}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </td>

      {/* Dosage */}
      <td className="px-2 py-1.5">
        <input
          type="text"
          value={row.dosage}
          onChange={e => onChange(index, 'dosage', e.target.value)}
          placeholder="e.g. 500mg"
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-200"
        />
      </td>

      {/* Duration */}
      <td className="px-2 py-1.5">
        <select
          value={row.duration}
          onChange={e => onChange(index, 'duration', e.target.value)}
          className="w-full border border-gray-300 rounded px-1 py-1 text-sm focus:outline-none focus:border-green-600 bg-white"
        >
          <option value="">Duration</option>
          {DURATION_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </td>

      {/* Frequency/Time */}
      <td className="px-2 py-1.5">
        <select
          value={row.frequency}
          onChange={e => onChange(index, 'frequency', e.target.value)}
          className="w-full border border-gray-300 rounded px-1 py-1 text-sm focus:outline-none focus:border-green-600 bg-white"
        >
          <option value="">Frequency</option>
          {FREQUENCY_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </td>

      {/* Remove */}
      <td className="px-2 py-1.5 text-center">
        <button
          onClick={() => onRemove(index)}
          className="text-red-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50"
          title="Remove row"
        >
          <Trash2 size={15} />
        </button>
      </td>
    </tr>
  );
}
