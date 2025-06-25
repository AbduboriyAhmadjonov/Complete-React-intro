import { Component } from "react";
import Link from "@tanstack/react-router";

class ErrorBoundary extends Component {
  state = { hasError: false };
  constructor(props) {
    super(props);
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    // You can log the error to an error reporting service (Sentry/TrackJS)
    console.error("ErrorBoundary caught some error:", error, info);
  }
  componentDidMount() {
    //
  }
  componentWillUnmount() {}
  componentDidUpdate() {}
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <p>
            There was an error with this page. <Link to="/">Click here</Link> to
            go back to the home page.
          </p>
        </div>
      );
    }

    return this.props.children; // Render the children components if no error occurred
  }
}

export default ErrorBoundary;
