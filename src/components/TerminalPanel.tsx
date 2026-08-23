import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { executeTerminalCommand } from '../lib/terminal'
import { useCommandCenterStore } from '../store/commandCenterStore'
import PanelFrame from './PanelFrame'

function TerminalPanel() {
  const navigate = useNavigate()
  const clearTerminalHistory = useCommandCenterStore((state) => state.clearTerminalHistory)
  const terminalHistory = useCommandCenterStore((state) => state.terminalHistory)
  const pushTerminalEntry = useCommandCenterStore((state) => state.pushTerminalEntry)
  const focusPanel = useCommandCenterStore((state) => state.focusPanel)
  const focusedPanel = useCommandCenterStore((state) => state.focusedPanel)
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = scrollRef.current

    if (!node) {
      return
    }

    node.scrollTop = node.scrollHeight
  }, [terminalHistory])

  return (
    <PanelFrame
      className="h-full"
      highlighted={focusedPanel === 'terminal'}
      panelId="terminal"
      title="Command terminal"
    >
      <div className="flex h-full min-h-0 flex-col gap-3">
        <div
          className="terminal-scroll flex-1 overflow-y-auto border border-white/6 bg-black/20 p-3 font-mono text-xs tracking-[0.12em] text-[color:var(--text-soft)]"
          ref={scrollRef}
        >
          {terminalHistory.length === 0 ? (
            <div className="space-y-2 text-[color:var(--text-dim)]">
              <p>Console ready.</p>
              <p>Use "help" to inspect available commands.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {terminalHistory.map((entry) => (
                <article className="space-y-2" key={entry.id}>
                  <div className="flex items-center gap-3">
                    <span className="text-[color:var(--green)]">ops://shell</span>
                    <span className="text-[color:var(--text)]">{entry.input}</span>
                  </div>
                  <div className="space-y-1 pl-5">
                    {entry.output.map((line, index) => (
                      <p
                        className={
                          entry.status === 'error'
                            ? 'text-[color:var(--danger)]'
                            : entry.status === 'info'
                              ? 'text-[color:var(--cyan)]'
                              : 'text-[color:var(--text-soft)]'
                        }
                        key={`${entry.id}-${index}`}
                      >
                        {line}
                      </p>
                    ))}
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--text-dim)]">{entry.timestamp}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <form
          className="border border-white/6 bg-black/15 p-3"
          onSubmit={(event) => {
            event.preventDefault()

            if (!input.trim()) {
              return
            }

            const entry = executeTerminalCommand(input, navigate)
            if (entry.commandId === 'clear') {
              clearTerminalHistory()
            } else {
              pushTerminalEntry(entry)
            }
            focusPanel('terminal')
            setInput('')
          }}
        >
          <label className="hud-label" htmlFor="command-input">
            Enter command
          </label>
          <div className="mt-3 flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-[color:var(--green)]">ops://</span>
            <input
              autoComplete="off"
              className="w-full border-none bg-transparent font-mono text-sm text-[color:var(--text)] outline-none placeholder:text-[color:var(--text-dim)]"
              id="command-input"
              onChange={(event) => setInput(event.target.value)}
              onFocus={() => focusPanel('terminal')}
              placeholder='showcomms / openmission "flavflix"'
              spellCheck={false}
              value={input}
            />
            <button className="control-button" type="submit">
              Run
            </button>
          </div>
        </form>
      </div>
    </PanelFrame>
  )
}

export default TerminalPanel
