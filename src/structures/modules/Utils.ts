import type { Player, PlaylistInfo, Track, UnresolvedTrack } from "lavalink-client";

type TrackItem = Track | UnresolvedTrack;
type PlaylistItem = PlaylistInfo;

export class Utils {
    /**
     * Formats the specified duration into human-readable time string.
     * @param ms - The duration in milliseconds.
     * @returns The formatted duration string.
     */
    public static formatDuration(ms: number): string {
        const seconds = Math.floor(ms / 1000) % 60;
        const minutes = Math.floor(ms / 60000) % 60;
        const hours = Math.floor(ms / 3600000) % 24;

        return `${hours > 0 ? `${hours}:` : ""}${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    }

    /**
     * Formats the specified time into human-readable date string.
     * @param time - The time in milliseconds.
     * @returns The formatted time string.
     */
    public static formatTime(time: number): string {
        const units = [
            { name: "year", value: 31536000 },
            { name: "month", value: 2592000 },
            { name: "week", value: 604800 },
            { name: "day", value: 86400 },
            { name: "hour", value: 3600 },
            { name: "minute", value: 60 },
            { name: "second", value: 1 },
        ];

        for (const unit of units) {
            if (time >= unit.value) {
                const count = Math.floor(time / unit.value);
                return `${count} ${unit.name}${count > 1 ? "s" : ""}`;
            }
        }

        return "Just now";
    }

    /**
     * Formats CPU usage into human-readable string.
     * @param usage - The usage bytes to format.
     * @returns The formatted usage string.
     */
    public static formatCPUUsage(usage: number): string {
        const cpuUsage = process.cpuUsage();
        const totalUsage = cpuUsage.user + cpuUsage.system;
        const cpuUsagePercentage = (usage / totalUsage) * 100;

        return `${cpuUsagePercentage.toFixed(2)}%`;
    }

    /**
     * Formats memory usage into human-readable string.
     * @param usage - The usage bytes to format.
     * @returns The formatted usage string.
     * @copyright https://github.com/Ganyu-Studios/stelle-music
     */
    public static formatMemoryUsage(bytes: number): string {
        const units = ["B", "KB", "MB", "GB", "TB"];
        let i = 0;

        while (bytes >= 1024 && i < units.length - 1) {
            bytes /= 1024;
            i++;
        }

        return `${bytes.toFixed(2)} ${units[i]}`;
    }

    /**
     * Discord hyperlink representation of the specified item.
     * @param item - The item to convert.
     * @returns The hyperlink string.
     */
    public static toHyperLink(item: TrackItem | PlaylistItem, query?: string): string {
        if ("info" in item) return `[${item.info.title}](${item.info.uri})`;
        return `[${item.name}](${item.uri ?? query ?? ""})`;
    }

    /**
     * String representation of track.
     * @param item - The item to convert.
     * @returns The string representation.
     */
    public static toString(item: TrackItem): string {
        return `*[${item?.info.title}](${item?.info.uri})* by *[${item?.info.author}](${item?.info.uri})*`;
    }

    /**
     * Slices the specified name to the maximum length.
     * @param name - The name to slice.
     * @param maxLength - The maximum length of the name.
     * @returns The sliced name.
     */
    public static spliceName(name: string, maxLength: number): string {
        return name.length > maxLength ? `${name.substring(0, maxLength / 2)}...` : name;
    }

    /**
     * Creates a progress bar to display the current position of the song.
     * @param player - The player to create the progress bar for.
     * @returns The progress bar string.
     */
    public static createProgressBar(player: Player) {
        const currentPosition = player.position ?? 0;
        const trackDuration = player.queue.current?.info.duration ?? 0;

        const line = "█";
        const space = "▁";

        const barLength = 15;
        const filledLength = Math.floor((currentPosition / trackDuration) * barLength);
        const emptyLength = barLength - filledLength;

        const bar = line.repeat(filledLength) + space.repeat(emptyLength);
        const formattedCurrentPosition = Utils.formatDuration(currentPosition);
        const formattedTrackDuration = Utils.formatDuration(trackDuration);

        return `${formattedCurrentPosition} [${bar}] ${formattedTrackDuration}`;
    }
}
