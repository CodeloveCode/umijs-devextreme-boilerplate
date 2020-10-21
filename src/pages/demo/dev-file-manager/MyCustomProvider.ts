import RemoteFileSystemProvider from 'devextreme/file_management/remote_provider';
import CustomFileSystemProvider from 'devextreme/file_management/custom_provider';
import FileSystemItem from 'devextreme/file_management/file_system_item';
import { deleteDocument, getDocuments } from './service';
import { notifyError } from '@/utils/devExtremeUtils';

class MyCustomProvider extends CustomFileSystemProvider {

    /** Gets file system items. */
    getItems(parentDirectory: FileSystemItem): Promise<Array<FileSystemItem>> {
        console.log('pathInfo', parentDirectory)
        return getDocuments().then(documents => {
            return documents
        }).catch((error: any) => {
            console.log(error.message)
            notifyError(error.message)
        })
    }
    FileSystemItem
    /** Renames a file or folder. */
    // renameItem(item: FileSystemItem, newName: string): Promise<any> & JQueryPromise<any>;

    // /** Creates a directory. */
    // createDirectory(parentDirectory: FileSystemItem, name: string): Promise<any> & JQueryPromise<any>;

    // /** Deletes files or folders. */
    // deleteItems(items: Array<FileSystemItem>): Array<Promise<any> & JQueryPromise<any>>;

    // /** Moves files and folders. */
    // moveItems(items: Array<FileSystemItem>, destinationDirectory: FileSystemItem): Array<Promise<any> & JQueryPromise<any>>;

    // /** Copies files or folders. */
    // copyItems(items: Array<FileSystemItem>, destinationDirectory: FileSystemItem): Array<Promise<any> & JQueryPromise<any>>;

    // /** Uploads a file in chunks. */
    // uploadFileChunk(fileData: File, uploadInfo: any, destinationDirectory: FileSystemItem): Promise<any> & JQueryPromise<any>;

    // /** Cancels the file upload. */
    // abortFileUpload(fileData: File, uploadInfo: any, destinationDirectory: FileSystemItem): Promise<any> & JQueryPromise<any>;

    // /** Downloads files. */
    // downloadItems(items: Array<FileSystemItem>): void;

    // /** Gets items content. */
    // getItemsContent(items: Array<FileSystemItem>): Promise<any> & JQueryPromise<any>;
}

// const customProviderOptions = {
//     getItems: function (parentDir: FileSystemItem) {
//         console.log('pathInfo', parentDir)
//         return getDocuments().then(documents => {
//             return documents
//         }).catch((error: any) => {
//             console.log(error.message)
//             notifyError(error.message)
//         })
//     },
//     isDirectoryExpr: 'isDirectory',
//     renameItem: function (item, name) {

//         // Your code goes here
//     },
//     createDirectory: function (parentDir, name) {
//         // Your code goes here
//     },
//     deleteItem: function (item: any) {
//         // Your code goes here
//         console.log('deleteItem', item)
//         return deleteDocument(item.id).then(isSuccess => {
//             return isSuccess
//         }).catch((error: any) => {
//             console.log(error.message)
//             notifyError(error.message)
//         })
//     },
//     moveItem: function (item, destinationDir) {
//         // Your code goes here
//     },
//     copyItem: function (item, destinationDir) {
//         // Your code goes here
//     },
//     uploadFileChunk: function (fileData, chunksInfo, destinationDir) {
//         // Your code goes here
//     },
//     abortFileUpload: function (fileData, chunksInfo, destinationDir) {
//         // Your code goes here
//     },
//     uploadChunkSize: 1000

// }

// const customProvider = new CustomFileSystemProvider(customProviderOptions)


export default MyCustomProvider