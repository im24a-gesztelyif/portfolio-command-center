import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { executeTerminalCommand } from '../lib/terminal'
import { cx } from '../lib/cx'
import { useCommandCenterStore } from '../store/commandCenterStore'

function TerminalDock() {
  const navigate = useNavigate()
  const clearTerminalHistory = useCommandCenterStore((state) => state.clearTerminalHistory)
  const terminalHistory = useCommandCenterStore((state) => state.terminalHistory)
  const pushTerminalEntry = useCommandCenterStore((state) => state.pushTerminalEntry)
  const focusPanel = useCommandCenterStore((state) => state.focusPanel)
  const focusedPanel = useCommandCenterStore((state) => state.focusedPanel)
  const terminalDockExpanded = useCommandCenterStore((state) => state.terminalDockExpanded)
  const activePage = useCommandCenterStore((state) => state.activePage)
  const [input, setInput] = useState('')

  const latestEntry = terminalHistory[terminalHistory.length - 1]
  const latestPreview = useMemo(() => latestEntry?.output[0] ?? 'Use "help" to inspect available commands.', [latestEntry])

  if (activePage === 'comms') {
    return null
  }

  return (
    <section
      className={cx('panel-frame mt-3 hidden shrink-0 rounded-sm lg:block', focusedPanel === 'terminal' && 'panel-highlight')}
      data-panel="terminal"
    >
      <div className="flex items-center gap-4 px-3 py-3 lg:px-4">
        <div className="min-w-[10rem]">
          <p className="hud-label">Command dock</p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--green)]">
            Console standby
          </p>
        </div>

        <form
          className="min-w-0 flex-1"
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
          <div className="flex items-center gap-3 border border-white/6 bg-black/15 px-3 py-2">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--green)]">ops://</span>
            <input
              autoComplete="off"
              className="w-full min-w-0 border-none bg-transparent font-mono text-sm text-[color:var(--text)] outline-none placeholder:text-[color:var(--text-dim)]"
              onChange={(event) => setInput(event.target.value)}
              placeholder='showcomms / openmission "flavflix"'
              spellCheck={false}
              value={input}
            />
            <button className="control-button" type="submit">
              Run
            </button>
          </div>
        </form>

        <div className="flex items-center gap-2">
          <button className="control-button" onClick={() => navigate('/comms')} type="button">
            Open console
          </button>
        </div>
      </div>

      {terminalDockExpanded ? (
        <div className="border-t border-white/6 px-4 py-2.5">
          <p className="font-mono text-xs leading-relaxed text-[color:var(--text-soft)]">{latestPreview}</p>
        </div>
      ) : null}
    </section>
  )
}

export default TerminalDock
