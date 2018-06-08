import React from 'react';
import { Label, Icon } from 'semantic-ui-react';

export const Wrapper = (props) => {
  if (props.status === "verified"){
    return (
      <div>
      <Label color='green' className="status">
        {Status.verified}
     </Label>
     </div>
    )
  } else if (props.status === "rejected"){
    return (
      <div>
      <Label color='red' className="status">
       {Status.rejected}
     </Label>
     </div>
    )
  }

  return (
    <div>
    <Label as="a" color='teal' className="status">
     <Icon name='external' />{Status.pending}
   </Label>
   </div>
  )
}

export const Status = {
  pending: "Pending Verification",
  rejected: "Smart Contract Rejected",
  verified: "Verified Smart Contract"
}
