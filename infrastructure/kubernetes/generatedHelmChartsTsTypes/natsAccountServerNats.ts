// Don't Edit. This is autogenerated.
export interface INatsAccountServerNats {
	accountserver: Accountserver;
	store: Store;
}
interface Store {
	type: string;
	file: File;
}
interface File {
	storageSize: string;
}
interface Accountserver {
	image: string;
	pullPolicy: string;
}
