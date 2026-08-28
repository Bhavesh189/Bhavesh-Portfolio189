
import React from 'react';

export default function Notfound() {
	return (
		<div className="nf-root" role="main">
			<div className="nf-card">
				<div className="nf-code">404</div>
				<div className="nf-info">
					<h1>Page Not Found</h1>
					<p>
						The page you are looking for doesn't exist or has been moved.
					</p>
					<div className="nf-actions">
						<button
							className="nf-btn"
							onClick={() => window.history.back()}
							aria-label="Go back"
						>
							Go Back
						</button>
						<a className="nf-link" href="/">Go to Homepage</a>
					</div>
				</div>
			</div>

			<style>{`
				.nf-root{
					min-height:100vh;
					display:flex;
					align-items:center;
					justify-content:center;
					background:linear-gradient(180deg,#f7f9fc,#eef2f7);
					padding:24px;
					box-sizing:border-box;
					font-family:Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
					color:#0f172a;
				}
				.nf-card{
					display:flex;
					align-items:center;
					gap:32px;
					background:#fff;
					border-radius:14px;
					padding:28px 36px;
					box-shadow:0 8px 30px rgba(16,24,40,0.08);
					max-width:980px;
					width:100%;
				}
				.nf-code{
					font-size:96px;
					font-weight:700;
					color:#e11d48;
					line-height:1;
					min-width:120px;
					text-align:center;
				}
				.nf-info h1{
					margin:0 0 8px 0;
					font-size:26px;
				}
				.nf-info p{
					margin:0 0 18px 0;
					color:#334155;
					max-width:520px;
				}
				.nf-actions{
					display:flex;
					gap:12px;
					flex-wrap:wrap;
				}
				.nf-btn{
					background:#0ea5a0;
					color:#fff;
					border:none;
					padding:10px 16px;
					border-radius:8px;
					cursor:pointer;
					font-weight:600;
				}
				.nf-btn:active{transform:translateY(1px)}
				.nf-link{
					display:inline-flex;
					align-items:center;
					padding:10px 14px;
					border-radius:8px;
					color:#0f172a;
					text-decoration:none;
					border:1px solid rgba(15,23,42,0.06);
					background:transparent;
				}

				/* Responsive layout */
				@media (max-width:760px){
					.nf-card{flex-direction:column; text-align:center; padding:28px; gap:18px}
					.nf-code{font-size:72px}
					.nf-info p{max-width:100%}
				}
				@media (max-width:360px){
					.nf-code{font-size:56px}
					.nf-card{padding:20px}
				}
			`}</style>
		</div>
	);
}