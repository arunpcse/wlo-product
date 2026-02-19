export default function LoadingSpinner({ text = 'Loading...' }) {
    return (
        <div className="page-center">
            <div className="spinner" />
            <p className="spinner-text">{text}</p>
        </div>
    );
}
