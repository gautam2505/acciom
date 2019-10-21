import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import {getDetailsOrganizationList,addToOrganizationList,updateOrganizationList} from '../actions/organizationManagementActions';
import { ORGANIZATIONNAME, ORGANIZATIONDESCRIPTION, ORGNAME, DESCRIPTION, ACTION, SMALL, ADDORGANIZATION, ADD, ORGANIZATION, ORG_TEXTBOX_NAME, ORG_TEXTBOX_DESC } from '../constants/FieldNameConstants';
import CustomTable from '../components/Table/CustomTable';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';
import Clear from '@material-ui/icons/Clear';
import GroupIcon from '@material-ui/icons/Group';
import { Button} from 'react-bootstrap';
import CustomModal from '../components/CommonModal/CustomModal';


const styles = theme => ({

	IconClass:{
		marginBottom:'-5px',
		marginLeft:'3px'
	}
});
class OrganizationManagement extends Component {
    
    textFieldHandler=()=>{
  
        if(event.target.name ===ORG_TEXTBOX_NAME){
        
         this.setState({organizationNameAdd:event.target.value})
    
        }
        
       else if(event.target.name ===ORG_TEXTBOX_DESC){
    
        this.setState({organizationDescriptionAdd:event.target.value})
    
        }
        
      }
    
    handleAddButtonHandler=()=>{
       
        this.setState({showAddConfirmationDialog:true});
    }
    cancelBtnClicked=()=>{
        this.hideUserInfoPopUp();
    }
    saveBtnClicked=()=>{
        let addToOrganizationDetails = {};
   
        addToOrganizationDetails={
              org_name:this.state.organizationNameAdd,
			  org_description:this.state.organizationDescriptionAdd,
				
            };
            if(this.validateConditions()){
                this.props.addToOrganizationList(JSON.stringify(addToOrganizationDetails));
                this.hideUserInfoPopUp();
            }
       
    }
    hideUserInfoPopUp=()=>{
        this.setState({showAddConfirmationDialog:false,organizationNameAdd:'',organizationDescriptionAdd:''});
    }
    validateConditions =()=>{
        const {organizationNameAdd ,organizationDescriptionAdd} =this.state;
        
        if(organizationNameAdd.length>0 && organizationDescriptionAdd.length>0){
            return true
           }
        return false
    }
    editHandler=(index)=>{
        
        this.setState({editIdx:index});
            const localOrgList = [...this.state.orgUserList];
            console.log('Local org list name',localOrgList[index].org_name);
		
			this.setState({organizationName:localOrgList[index].org_name});
            this.setState({organizationDescription:localOrgList[index].org_description});
         

    }
    saveDataHandler=(index)=>{	
		
        const localOrgListHandler = [...this.state.orgUserList];
    
        localOrgListHandler[index].org_name = this.state.organizationName;
        localOrgListHandler[index].org_description = this.state.organizationDescription;
    
        let upDateOrgDetails = {};

        upDateOrgDetails={
            org_name:localOrgListHandler[index].org_name,
            org_description:localOrgListHandler[index].org_description,
            org_id:localOrgListHandler[index].org_id
        };
        if(localOrgListHandler[index].org_description.length ==0){
        
            toast.error(PROJDESCTEXT);
            
        }
        else 
        if(localOrgListHandler[index].org_name.length ==0){
            toast.error(PROJNAMETEXT);

        }
        
if(localOrgListHandler[index].org_name.length >0 && localOrgListHandler[index].org_description.length>0){
    this.props.updateOrganizationList(JSON.stringify(upDateOrgDetails));
    
}
this.setState({editIdx:-1});

             
    }
    handleChangeHandler=(event)=>{
        if(event.target.name ===ORGANIZATIONNAME){
            console.log('Name change');
        
            this.setState({organizationName:event.target.value});
        }
        else if(event.target.name ===ORGANIZATIONDESCRIPTION){
            console.log('Description Change');
            
            this.setState({organizationDescription:event.target.value});
        }

    }
    clearDataHandler=()=>{
        
			this.setState({editIdx:-1});
    }
    static getDerivedStateFromProps = (nextProps, prevState) => {
       
        if(nextProps.refreshOrganizationDetails){
            console.log('In static');
	
            nextProps.getDetailsOrganizationList();
            return {
                prevState
            };
        }
     
            if(nextProps.organizationUserList.length === 0){
                nextProps.getDetailsOrganizationList();
                return {
                    prevState
                     };

                  }
                  if(prevState.organizationUserList!== nextProps.organizationUserList){
                    return {
                        ...prevState,
                        orgUserList: nextProps.organizationUserList
                        };
        
                }
            
		
    }
   
    constructor(props) {
		super(props);
		this.state = {
            headers : [
				{ id: ORGANIZATIONNAME,  label: ORGNAME },
				{ id: ORGANIZATIONDESCRIPTION,  label: DESCRIPTION },
              ],
              orgUserList:[],
              showAddConfirmationDialog:false,
              organizationNameAdd:'',
              organizationDescriptionAdd:'',
              organizationName:'',
              organizationDescription:'',
              location:ORGANIZATION,
              editIdx:-1

        }
    }
    render(){
        const {headers,orgUserList}=this.state;
        const orgModifyData=[];
      
        if(orgUserList){
			orgUserList.forEach((org,index) => {
				orgModifyData.push({
					org_name: org.org_name,
					org_description: org.org_description,
				
					action: (
						<Fragment>
							
							<EditIcon 
								fontSize={SMALL}
								className="editicon2" 
								style={{color:"#696969" ,marginRight:'8px'}} 
							    onClick ={() =>{this.editHandler(index);}}
							/>
					  <DeleteIcon 
							  className="cursorhover" 
							  fontSize={SMALL}
							  style={{color:"#696969",marginRight:'8px'}} 
							  onClick ={() =>{this.deleteItemHandler(project.project_id);}}
							   />

						</Fragment>
					
					),
					editingIconAction:(
						<Fragment>
							<CheckIcon
						  style={{color:"#696969" ,marginRight:'8px'}} 
                          onClick ={()=>this.saveDataHandler(index)}
						  /> 
						  <Clear
						   fontSize={SMALL}
						   style={{color:"#696969",marginRight:'8px'}} 
                           onClick={()=>this.clearDataHandler()}
                        />
						</Fragment>

					)
				});

			});
            
		}
        return(
            <Fragment>
                	<div>
				<GroupIcon className=" organizationManagementIcon" />
			&nbsp; &nbsp;

				
                    <label className="main_titles projectManagementMargin" >
                    Organization Management
                    </label>
					<Button 
					className="backbutton_colors_project addUserButton"
					onClick={this.handleAddButtonHandler}
                    >
                    {ADDORGANIZATION}
                    </Button>


				</div>
                <CustomTable
                  headers={headers}
                  bodyData={orgModifyData}
                  actionLabel={ACTION}
                  editIdx ={this.state.editIdx}
                  orgNameValue ={this.state.organizationName}
				  orgDescriptionValue ={this.state.organizationDescription}
                  handleChange ={this.handleChangeHandler}
                  /> 
                  	{
                  this.state.showAddConfirmationDialog? 
                  <CustomModal
				   organizationNameAdd={this.state.organizationNameAdd}
				   organizationDescriptionAdd={this.state.organizationDescriptionAdd}
				   onCancelBtnClicked ={this.cancelBtnClicked}
				   onSaveBtnClicked ={this.saveBtnClicked}
				   onTextFieldHandler={this.textFieldHandler} 
				   currentPage ={this.state.location}  
				   validateFields ={this.validateConditions()} 
				   variant ={ADD}
                   />:null
				}
            </Fragment>
        )
    }

}
const mapStateToProps = (state) => {
    return{
        currentOrg: state.appData.currentOrg,
        organizationUserList:state.organizationManagementData.organizationUserList,
        refreshOrganizationDetails:state.organizationManagementData.refreshOrganizationDetails
    };
}
const mapDispatchToProps =dispatch=>({
    getDetailsOrganizationList: (data) => dispatch(getDetailsOrganizationList(data)),
    addToOrganizationList:(data)=>dispatch(addToOrganizationList(data)),
    updateOrganizationList:(data)=>dispatch(updateOrganizationList(data))
})
export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(OrganizationManagement));
