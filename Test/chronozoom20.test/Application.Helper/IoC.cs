using Application.Driver.Constants;
using Application.Helper.BrowserImpl;
using Framework.Interfaces;
using Microsoft.Practices.Unity;

namespace Application.Helper
{
    /// <summary>
    /// Unity container using for registration
    /// </summary>
    public static class IoC
    {
        private static IDependencyResolver _resolver;

        public static void Initialize(IDependencyResolver resolver)
        {
            _resolver = resolver;
        }

        public static T Resolve<T>()
        {
            return _resolver.Resolve<T>();
        }

        public static T Resolve<T>(string name)
        {
            return _resolver.Resolve<T>(name);
        }
    }

    public interface IDependencyResolver
    {
        T Resolve<T>(string name);
        T Resolve<T>();
    }

    /// <summary>
    /// Class for cross-browser compatibility realization.
    /// The class allows to implement different depending on a browser
    /// </summary>
    public class UnityDependencyResolver : IDependencyResolver
    {
        private readonly IUnityContainer _container;

        public UnityDependencyResolver()
        {
            _container = new UnityContainer();
            _container.RegisterType<IControls, IeControls>(BrowserNames.InternetExplorer);
            _container.RegisterType<IControls, ChromeControls>(BrowserNames.Chrome);
            _container.RegisterType<IControls, FirefoxControls>(BrowserNames.Firefox);
            _container.RegisterType<IControls, SafariControls>(BrowserNames.Safari);
        }

        public T Resolve<T>()
        {
            return _container.Resolve<T>();
        }

        public T Resolve<T>(string name)
        {
            return _container.Resolve<T>(name);
        }
    }
}