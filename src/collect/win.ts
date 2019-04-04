let win =
  typeof window !== 'undefined'
    ? window
    : {
        external: false,
        navigator: {
          userAgent: '',
          language: '',
          appVersion: '',
          vendor: ''
        },
        location: {
          pathname: '',
          href: ''
        },
        document: {
          URL: '',
          title: '',
          referrer: ''
        },
        screen: {
          width: '',
          height: ''
        }
      }

export default win
