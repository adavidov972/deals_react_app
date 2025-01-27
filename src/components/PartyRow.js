import React from 'react'
import { connect } from 'react-redux'

export const PartyRow = ([parties]) => {
  return (
    parties.map(party => {
      <tr key={party.index}>
        <td><input type="text" name={`last_name`} defaultValue={party?.last_name || ""} /></td>
        <td><input type="text" name={`first_name`} defaultValue={party?.firstName || ""} /></td>
        <td><input type="text" name={`id_kind`} defaultValue={party?.idKind || ""} /></td>
        <td><input type="text" name={`id`} defaultValue={party?.id || ""} /></td>
        <td><input type="text" name={`parts`} defaultValue={party?.parts || ""} /></td>
        <td><input type="checkbox" name={`is_firm`} defaultChecked={party?.isFirm || false} /></td>
      </tr>
    })
  )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(PartyRow)