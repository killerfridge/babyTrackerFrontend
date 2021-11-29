export function formatLength(d) {
    const date = new Date(d)
    const milliseconds = date.getTime()
    const seconds = Math.floor(milliseconds / 1000)
    const mins = Math.floor(seconds / 60)
    const hours = Math.floor(mins / 60)

    if (hours){
        return `${hours} hours, ${mins % 60} minutes`
    } else if (mins){
        return `${mins} minutes, ${seconds % 60} seconds`
    } else {
        return `${seconds} seconds`
    }
}
