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
                $('#frmAddEditors input').focus();
            }
        }
    }
}