//Code from http://www.wibit.net/blog/integrating_ghostscript_c
using System;
using System.Runtime.InteropServices;
using System.Collections;

namespace ThumbGen
{
    public class WGScript
    {
        // Import GS Dll
        [DllImport("gsdll64.dll")]
        private static extern int gsapi_new_instance(out IntPtr pinstance, IntPtr caller_handle);

        [DllImport("gsdll64.dll")]
        private static extern int gsapi_init_with_args(IntPtr instance, int argc, IntPtr argv);

        [DllImport("gsdll64.dll")]
        private static extern int gsapi_exit(IntPtr instance);

        [DllImport("gsdll64.dll")]
        private static extern void gsapi_delete_instance(IntPtr instance);

        // Set variables to be used in the class
        private ArrayList _gsParams = new ArrayList();
        private IntPtr _gsInstancePtr;
        private GCHandle[] _gsArgStrHandles = null;
        private IntPtr[] _gsArgPtrs = null;
        private GCHandle _gsArgPtrsHandle;

        public WGScript() { }
        public WGScript(string[] Params)
        {
            _gsParams.AddRange(Params);
            Execute();
        }

        public string[] Params
        {
            get { return (string[])_gsParams.ToArray(typeof(string)); }
        }

        public void AddParam(string Param) { _gsParams.Add(Param); }
        public void RemoveParamAtIndex(int Index) { _gsParams.RemoveAt(Index); }
        public void RemoveParam(string Param) { _gsParams.Remove(Param); }

        public void Execute()
        {
            // Create GS Instance (GS-API)
            gsapi_new_instance(out _gsInstancePtr, IntPtr.Zero);
            // Build Argument Arrays
            _gsArgStrHandles = new GCHandle[_gsParams.Count];
            _gsArgPtrs = new IntPtr[_gsParams.Count];

            // Populate Argument Arrays
            for (int i = 0; i < _gsParams.Count; i++)
            {
                _gsArgStrHandles[i] = GCHandle.Alloc(System.Text.ASCIIEncoding.ASCII.GetBytes(_gsParams[i].ToString()), GCHandleType.Pinned);
                _gsArgPtrs[i] = _gsArgStrHandles[i].AddrOfPinnedObject();
            }

            // Allocate memory that is protected from Garbage Collection
            _gsArgPtrsHandle = GCHandle.Alloc(_gsArgPtrs, GCHandleType.Pinned);
            // Init args with GS instance (GS-API)
            gsapi_init_with_args(_gsInstancePtr, _gsArgStrHandles.Length, _gsArgPtrsHandle.AddrOfPinnedObject());
            // Free unmanaged memory
            for (int i = 0; i < _gsArgStrHandles.Length; i++)
                _gsArgStrHandles[i].Free();
            _gsArgPtrsHandle.Free();

            // Exit the api (GS-API)
            gsapi_exit(_gsInstancePtr);
            // Delete GS Instance (GS-API)
            gsapi_delete_instance(_gsInstancePtr);
        }
    }
}
