import Header from './Header'

export default function Layout({ children }) {
  return (
    <div className="layout">
      <Header />
      <main className="main">{children}</main>
    </div>
  )
}