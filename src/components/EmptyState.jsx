function EmptyState({ icon = '—', title, body, isError = false, onRetry }) {
  return (
    <div className={`state-block${isError ? ' is-error' : ''}`}>
      <div className="state-icon" aria-hidden="true">{isError ? '!' : icon}</div>
      <h3>{title}</h3>
      <p>{body}</p>
      {isError && onRetry && (
        <button type="button" className="btn ghost" onClick={onRetry}>Try Again</button>
      )}
    </div>
  )
}

export default EmptyState