import { Link, Outlet } from "react-router-dom";
function Nav() {
  return (
    <div>
      <nav className="navbar navbar-expand-sm navbar-light bg-primary">
        <div className="container">
          <button
            className="navbar-toggler d-lg-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapsibleNavId"
            aria-controls="collapsibleNavId"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="collapsibleNavId">
            <ul className="navbar-nav me-auto mt-2 mt-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" to="/Home">
                  Home
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link active" to="/GroupChat">
                  Group Chat
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/Userlist">
                  Manage user
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/DocumentList">
                  Manage Documents
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/Logout">
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
}

export default Nav;
