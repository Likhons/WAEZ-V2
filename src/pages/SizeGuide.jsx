import { Link } from 'react-router-dom'

function SizeGuide() {
  return (
    <div className="wrap static-page">
      <section className="static-hero">
        <div className="eyebrow">WAEZ / Size Guide</div>
        <h1>Find Your Fit.</h1>
        <p className="static-lead">Use the measurements below as a guide when choosing your WAEZ size.</p>
      </section>

      <section className="size-guide-section">
        <div className="size-table-wrap">
          <table className="size-guide-table">
            <caption>Measurements are in inches.</caption>
            <thead>
              <tr>
                <th scope="col">Size</th>
                <th scope="col">Chest</th>
                <th scope="col">Length</th>
                <th scope="col">Shoulder</th>
              </tr>
            </thead>
            <tbody>
              <tr><th scope="row">S</th><td>40"</td><td>27"</td><td>17"</td></tr>
              <tr><th scope="row">M</th><td>42"</td><td>28"</td><td>18"</td></tr>
              <tr><th scope="row">L</th><td>44"</td><td>29"</td><td>19"</td></tr>
              <tr><th scope="row">XL</th><td>46"</td><td>30"</td><td>20"</td></tr>
            </tbody>
          </table>
        </div>

        <div className="size-guide-help">
          <div>
            <div className="eyebrow">Between Sizes?</div>
            <h2>Go one size up for a more relaxed fit.</h2>
            <p>If you're between two sizes, we recommend choosing the larger size for a more relaxed everyday fit.</p>
          </div>
          <Link to="/contact" className="btn ghost">Need Help?</Link>
        </div>
      </section>
    </div>
  )
}

export default SizeGuide