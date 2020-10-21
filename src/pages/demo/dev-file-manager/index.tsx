import React from 'react';
import { Popup } from 'devextreme-react';
import FileManager, { Permissions } from 'devextreme-react/file-manager';
import RemoteFileSystemProvider from 'devextreme/file_management/remote_provider';
import CustomFileSystemProvider from 'devextreme/file_management/custom_provider';
import "./index.less";
import { notifyError } from '@/utils/devExtremeUtils';
import FileSystemItem from 'devextreme/file_management/file_system_item';
import MyCustomProvider from './MyCustomProvider';

// const remoteProvider = new RemoteFileSystemProvider({
//     endpointUrl: 'https://js.devexpress.com/Demos/Mvc/api/file-manager-file-system-images',
//     // hasSubDirectoriesExpr:'isDirectory'
// });

const customProvider = new MyCustomProvider()
export default class FileManagerDemo extends React.Component<any, any>{


    constructor(props: any) {
        super(props);
        this.state = {
            documents: [],
            currentPath: 'Widescreen',
            popupVisible: false,
            imageItemToDisplay: {}
        };


    }

    componentDidMount() {
        // this.doQuery()
    }

    displayImagePopup = (e: any) => {
        console.log('fileInfo', e.file.name, e.file.dataItem.url)
        this.setState({
            popupVisible: true,
            imageItemToDisplay: {
                name: e.file.name,
                url: e.file.dataItem.url
            }
        });
    }

    hideImagePopup = () => {
        this.setState({
            popupVisible: false
        });
    }

    onCurrentDirectoryChanged = (e: any) => {
        console.log(e.component.option('currentPath'))
        this.setState({
            currentPath: e.component.option('currentPath')
        });
    }

    render() {
        const { documents } = this.state

        return (
            <div>
                <FileManager
                    currentPath={this.state.currentPath}
                    fileSystemProvider={customProvider}
                    onSelectedFileOpened={this.displayImagePopup}
                    onCurrentDirectoryChanged={this.onCurrentDirectoryChanged}>
                    <Permissions
                        create={true}
                        copy={true}
                        move={true}
                        delete={false}
                        rename={true}
                        upload={true}
                        download={true}>
                    </Permissions>
                </FileManager>

                <Popup
                    maxHeight={600}
                    closeOnOutsideClick={true}
                    title={this.state.imageItemToDisplay.name}
                    visible={this.state.popupVisible}
                    onHiding={this.hideImagePopup}
                    className="photo-popup-content">

                    <img src={this.state.imageItemToDisplay.url} className="photo-popup-image" />
                </Popup>
            </div>
        );
    }


}

