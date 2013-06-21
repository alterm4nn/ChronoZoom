namespace Application.Helper
{
    public class HelperManager<T> where T : class, new()
    {
        private HelperManager() { }

        public static T GetInstance
        {
            get
            {
                return SingletonCreator.Instance;
            }
        }

        private class SingletonCreator
        {
            static SingletonCreator() { }

            internal static readonly T Instance = new T();
        }
    }
}