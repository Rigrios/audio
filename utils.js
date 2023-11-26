const format = (time) => (time < 10 ? `0${time}` : time)


export const toMinAndSec = (duration) => {
    const minutes = format(Math.floor(duration / 60))
    const seconds = format(Math.floor(duration - minutes * 60))
    return `${minutes}:${seconds}`
}


