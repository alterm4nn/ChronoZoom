/// <reference path='../ui/controls/formbase.ts'/>
/// <reference path='../scripts/authoring.ts'/>
/// <reference path='../scripts/settings.ts'/>
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>

module CZ
{
    export module UI
    {
        export interface IFormManageEditors extends CZ.UI.IFormUpdateEntityInfo
        {
        }

        export class FormManageEditors extends FormUpdateEntity
        {
            constructor(container: JQuery, formInfo: IFormManageEditors)
            {
                super(container, formInfo);

                // populate list of existing editors
                CZ.Service.getMembers().done(data => {
                    if (data.length == 0) {
                        $('#tblDelEditors tbody').html('<tr class="none"><td colspan="2" class="cz-lightgray center">&mdash; None &mdash;</td></tr>');
                    }
                    else {
                        $('#tblDelEditors tbody').html('');
                        data.forEach(function (member) {
                            $('#tblDelEditors tbody').append
                            (
                                '<tr data-id="' + member.User.Id + '">' +
                                    '<td class="delete" title="Remove Editor"></td>' +
                                    '<td title="' + member.User.DisplayName + '">' + member.User.DisplayName + '</td>' +
                                '</tr>'
                            );
                        });
                    }
                });

                // populate search results every time find input is altered
                $('#tblAddEditors input[type="search"]').off('input').on('input', function (event) {
                    CZ.Service.findUsers($(this).val()).done(data => {
                        $(this).closest('table').find('tbody').html('');
                        $(this).closest('tr').find('input[type="checkbox"]').prop('checked', false);
                        data.forEach(function (user) {
                            $('#tblAddEditors tbody').append
                            (
                                '<tr data-id="' + user.Id + '">' +
                                    '<td class="select" title="Select/Unselect This User"><input type="checkbox" /></td>' +
                                    '<td title="' + user.DisplayName + '">' + user.DisplayName + '</td>' +
                                '</tr>'
                            );
                        });
                        if (data.length == 0) {
                            $(this).closest('table').find('tfoot').hide();
                        }
                        else {
                            $(this).closest('table').find('tfoot').show();
                        }
                    });
                });

                // send chosen list of user ids when save button is clicked
                $('#auth-edit-collection-editors .cz-form-save').off().click(function (event) {

                    var userIds = new Array();

                    $('#tblDelEditors tbody tr:not(.none)').each(function (index) {
                        userIds.push($(this).attr('data-id'));
                    });

                    CZ.Service.putMembers(CZ.Service.superCollectionName, CZ.Service.collectionName, userIds).always(() => {
                        $('#auth-edit-collection-editors').hide();
                    });
                });
            }
        }
    }
}