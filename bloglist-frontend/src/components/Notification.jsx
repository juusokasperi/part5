const Notification = ({ info }) => {
  if (info.message === null) {
    return null
  }

  const style = {
    color: info.type === 'error' ? 'red' : 'green',
    background: '#f9f9f9',
    fontSize: 14,
    fontFamily: 'courier',
    borderStyle: 'inset',
    borderRadius: 3,
    width: '400px',
    textAlign: 'center',
    padding: 10,
    marginBottom: 10,
  }

  return (
    <div className="info" style={style}>
      {info.message}
    </div>
  )

}

export default Notification