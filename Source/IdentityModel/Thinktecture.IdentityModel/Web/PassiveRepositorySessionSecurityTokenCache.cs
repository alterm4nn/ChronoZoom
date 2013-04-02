using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Security;
using Microsoft.IdentityModel;
using Microsoft.IdentityModel.Tokens;

namespace Thinktecture.IdentityModel.Web
{
    public class PassiveRepositorySessionSecurityTokenCache : SecurityTokenCache
    {
        const string Purpose = "PassiveSessionTokenCache";

        ITokenCacheRepository tokenCacheRepository;
        SecurityTokenCache inner;

        SessionSecurityTokenCookieSerializer serializer;

        public PassiveRepositorySessionSecurityTokenCache(ITokenCacheRepository tokenCacheRepository)
            : this(tokenCacheRepository, new MruSecurityTokenCache())
        {
        }

        public PassiveRepositorySessionSecurityTokenCache(
            ITokenCacheRepository tokenCacheRepository, 
            SecurityTokenCache inner)
        {
            if (tokenCacheRepository == null) throw new ArgumentNullException("tokenCacheRepository");
            if (inner == null) throw new ArgumentNullException("inner");

            this.tokenCacheRepository = tokenCacheRepository;
            this.inner = inner;

            serializer = new SessionSecurityTokenCookieSerializer();
        }

        static object lastCleanupLock = new object();
        static DateTime? lastCleanup;
        const int cleanupIntervalHours = 6;
        
        void CleanupOldTokens()
        {
            lock(lastCleanupLock)
            {
                if (lastCleanup == null || lastCleanup < DateTime.UtcNow.AddHours(-cleanupIntervalHours))
                {
                    lastCleanup = DateTime.UtcNow;

                    Task.Factory.StartNew(
                        delegate
                        {
                            // cleanup old tokens
                            DateTime date = DateTime.UtcNow.AddHours(-cleanupIntervalHours);
                            this.tokenCacheRepository.RemoveAllBefore(date);
                        })
                    .ContinueWith(task =>
                        {
                            // don't take down process if this fails 
                            // if ThrowUnobservedTaskExceptions is enabled
                            if (task.IsFaulted)
                            {
                                var ex = task.Exception;
                            }
                        });
                }
            }
        }

        byte[] TokenToBytes(SessionSecurityToken token)
        {
            if (token == null) return null;
            
            var bytes = serializer.Serialize(token);
            var str = MachineKey.Encode(bytes, MachineKeyProtection.All);
            return System.Text.Encoding.UTF8.GetBytes(str);
        }

        SessionSecurityToken BytesToToken(byte[] bytes)
        {
            if (bytes == null || bytes.Length == 0) return null;

            var str = System.Text.Encoding.UTF8.GetString(bytes);
            bytes = MachineKey.Decode(str, MachineKeyProtection.All);
            return serializer.Deserialize(bytes);
        }

        private static string GetCacheKey(object key)
        {
            Guid guid;

            var kg = ((SecurityTokenCacheKey)key).KeyGeneration;
            kg.TryGetGuid(out guid);
            var cacheKey = guid.ToString().Replace("-", "");

            return cacheKey;
        }

        public override void ClearEntries()
        {
            throw new NotImplementedException();
        }

        public override bool TryAddEntry(object key, System.IdentityModel.Tokens.SecurityToken value)
        {
            if (key == null) throw new ArgumentNullException("key");

            CleanupOldTokens();
            
            var cacheKey = GetCacheKey(key);
            var item = new TokenCacheItem
            {
                Key = cacheKey,
                Expires = value.ValidTo,
                Token = TokenToBytes((SessionSecurityToken)value),
            };
            tokenCacheRepository.AddOrUpdate(item);

            return inner.TryAddEntry(key, value);
        }

        public override bool TryGetAllEntries(object key, out IList<System.IdentityModel.Tokens.SecurityToken> tokens)
        {
            throw new NotImplementedException();
        }

        public override bool TryGetEntry(object key, out System.IdentityModel.Tokens.SecurityToken value)
        {
            if (key == null) throw new ArgumentNullException("key");

            CleanupOldTokens();

            if (inner.TryGetEntry(key, out value))
            {
                return true;
            }

            value = null;

            var cacheKey = GetCacheKey(key);
            var item = tokenCacheRepository.Get(cacheKey);
            if (item == null) return false;

            value = BytesToToken(item.Token);

            // update in-mem cache from database
            inner.TryAddEntry(key, value);

            return true;
        }

        public override bool TryRemoveAllEntries(object key)
        {
            throw new NotImplementedException();
        }

        public override bool TryRemoveEntry(object key)
        {
            CleanupOldTokens();

            if (key == null) throw new ArgumentNullException("key");

            var cacheKey = GetCacheKey(key);
            tokenCacheRepository.Remove(cacheKey);
            return inner.TryRemoveEntry(key);
        }

        public override bool TryReplaceEntry(object key, System.IdentityModel.Tokens.SecurityToken newValue)
        {
            if (key == null) throw new ArgumentNullException("key");

            CleanupOldTokens();
            
            var cacheKey = GetCacheKey(key);
            var item = new TokenCacheItem
            {
                Key = cacheKey,
                Expires = newValue.ValidTo,
                Token = TokenToBytes((SessionSecurityToken)newValue),
            };
            tokenCacheRepository.AddOrUpdate(item);

            return inner.TryReplaceEntry(key, newValue);
        }
    }
}
